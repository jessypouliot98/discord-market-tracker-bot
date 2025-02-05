import {
  Client,
  type Interaction,
  SlashCommandBuilder
} from "discord.js";
import { deleteTrackerByChannelId } from "../../../db/app/tracker/mutations/deleteTrackerByChannelId.ts";

export const command = new SlashCommandBuilder()
  .setName("destroy")
  .setDescription("Delete a tracker channel")

export async function execute(interaction: Interaction, client: Client) {
  if (!interaction.isChatInputCommand()) return;
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply(`Uh oh! No permissions for guild?`)
    return;
  }

  const channel = interaction.channel
  if (!channel) {
    await interaction.reply(`Uh oh! No permissions for channel?`)
    return;
  }

  await deleteTrackerByChannelId(channel.id);
  await channel.delete()
}