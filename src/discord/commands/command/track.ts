import {
  ChannelType,
  Client,
  type Interaction,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";
import { sqlClient } from "../../../db/sql/client.ts";
import { sql } from "../../../utils/sql";
import { type Tracker } from "../../../db/app/tracker/model.ts";
import { scrapeTracker } from "../../../scrapper/scrapeTracker.ts";
import { browserPromise } from "../../../browser.ts";

export const command = new SlashCommandBuilder()
  .setName("track")
  .setDescription("Start tracking a marketplace")
  .addStringOption((option) => {
    return option
      .setName("name")
      .setDescription("The name of the tracker")
      .setRequired(true)
  })
  .addStringOption((option) => {
    return option
      .setName("url")
      .setDescription("Url to track")
      .setRequired(true)
  });

export async function execute(interaction: Interaction, client: Client) {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild) {
    await interaction.reply(`Uh oh! No permissions for guild?`)
    return;
  }
  const url = interaction.options.getString("url");
  if (!url) {
    await interaction.reply("url is required")
    return;
  }
  const newChannel = await interaction.guild.channels.create({
    name: interaction.options.getString("name") ?? "new-tracker",
    type: ChannelType.GuildText,
    topic: url,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ]
  });
  const trackerData: Omit<Tracker, "id"> = {
    name: newChannel.name,
    type: "facebook-marketplace",
    url,
    channel_id: newChannel.id,
    author_id: interaction.user.id,
  }
  const insertTrackerResult = await sqlClient.execute(sql`
    INSERT INTO tracker (name, type, url, channel_id)
    VALUES (
      ${trackerData.name},
      ${trackerData.type},
      ${trackerData.url},
      ${trackerData.channel_id}
    )
    RETURNING tracker.id
  `);
  const insertedTrackerId = insertTrackerResult.rows[0]?.id;
  if (typeof insertedTrackerId !== "number") throw new Error("Inserted tracker id is expected to be a string");
  const tracker: Tracker = Object.assign(trackerData, {
    id: insertedTrackerId,
  })

  await interaction.reply({
    content: `Tracking [${newChannel.name}](${url})`,
  })

  const browser = await browserPromise;
  const page = await browser.newPage();

  try {
    await scrapeTracker({
      tracker,
      page,
      discordClient: client,
    })
  } catch (error) {
    console.error(error);
  } finally {
    await page.close();
  }
}