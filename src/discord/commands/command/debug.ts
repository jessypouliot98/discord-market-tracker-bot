import {
  Client,
  type Interaction,
  SlashCommandBuilder
} from "discord.js";
import { deleteTrackerByChannelId } from "../../../db/app/tracker/mutations/deleteTrackerByChannelId.ts";
import { queryTrackerByChannelId } from "../../../db/app/tracker/queries/queryTrackerByChannelId.ts";

export const command = new SlashCommandBuilder()
  .setName("debug")
  .setDescription("Replies with debug information")

export async function execute(interaction: Interaction, client: Client) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply(`Uh oh! No permissions for guild?`)
    return;
  }

  const builder: string[] = [
    `guild_id: ${guild.id}`,
    `your_user_id: ${interaction.user.id}`,
  ];

  if (interaction.channelId) {
    const tracker = await queryTrackerByChannelId(interaction.channelId);
    builder.push(`channel_id: ${interaction.channelId}`);
    builder.push(`tracker_id: ${tracker?.id ?? "-"}`);
    if (tracker) {
      builder.push(`tracker_name: ${tracker.name}`);
      builder.push(`tracker_owner_id: ${tracker.owner_id}`);
      builder.push(`tracker_type: ${tracker.type}`);
      builder.push(`tracker_url: ${tracker.url}`);
    }
  } else {
    builder.push(`channel_id: -`)
  }

  await interaction.reply({
    content: builder.join("\n"),
    embeds: [],
  })
}