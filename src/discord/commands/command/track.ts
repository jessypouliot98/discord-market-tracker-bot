import { ChannelType, Client, type Interaction, SlashCommandBuilder } from "discord.js";
import { sqlClient } from "../../../db/sql/client.ts";
import { sql } from "../../../utils/sql";
import { type Tracker } from "../../../db/app/tracker/model.ts";
import { scrapeTracker } from "../../../scrapper/scrapeTracker.ts";
import { chromium } from "playwright";

const browser = chromium.launch({});

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
  });
  const tracker: Tracker = {
    name: newChannel.name,
    type: "facebook-marketplace",
    url,
    channel_id: newChannel.id,
  }
  const insertTrackerResult = await sqlClient.execute(sql`
    INSERT INTO tracker (name, type, url, channel_id)
    VALUES (
      ${tracker.name},
      ${tracker.type},
      ${tracker.url},
      ${tracker.channel_id}
    )
    RETURNING tracker.id
  `);
  if (typeof insertTrackerResult.rows[0]?.id === "number") {
    tracker.id = insertTrackerResult.rows[0].id;
  }

  await interaction.reply({
    content: `Tracking [${newChannel.name}](${url})`,
  })

  const page = await (await browser).newPage();

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