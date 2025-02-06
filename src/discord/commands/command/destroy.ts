import {
  Client,
  type Interaction,
  SlashCommandBuilder
} from "discord.js";
import { deleteTrackerByChannelId } from "../../../db/app/tracker/mutations/deleteTrackerByChannelId.ts";
import { queryTrackerByChannelId } from "../../../db/app/tracker/queries/queryTrackerByChannelId.ts";

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

  const tracker = await queryTrackerByChannelId(channel.id);
  if (!tracker) {
    throw new Error("tracker not found");
  }

  if (tracker.owner_id !== interaction.user.id) {
    await interaction.reply(`Uh oh! You're must be the tracker owner to destroy it`)
    return;
  }

  await deleteTrackerByChannelId(channel.id);
  await channel.delete()
}