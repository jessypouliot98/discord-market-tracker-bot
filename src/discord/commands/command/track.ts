import { ChannelType, Client, type Interaction, SlashCommandBuilder } from "discord.js";
import { sqlClient } from "../../../db/sql/client.ts";
import { sql } from "../../../utils/sql";

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
  await sqlClient.execute(sql`
    INSERT INTO tracker (name, type, url, channel_id)
    VALUES (
      ${newChannel.name},
      ${"facebook-marketplace"},
      ${url},
      ${newChannel.id}
    )
  `);
  interaction.reply({
    content: `Tracking [${newChannel.name}](${url})`,
  })
}