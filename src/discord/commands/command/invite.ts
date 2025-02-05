import {
  ChannelType,
  Client,
  type Interaction,
  SlashCommandBuilder
} from "discord.js";
import { queryTrackerByChannelId } from "../../../db/app/tracker/queries/queryTrackerByChannelId.ts";

export const command = new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Invite a user to the tracker channel")
  .addUserOption((option) => {
    return option
      .setName("user")
      .setDescription("User to invite")
      .setRequired(true)
  })

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
  if (channel.type !== ChannelType.GuildText) {
    return;
  }

  const invitedUser = interaction.options.getUser("user");
  if (!invitedUser) {
    await interaction.reply("User is required")
    return;
  }

  const tracker = await queryTrackerByChannelId(channel.id);
  if (!tracker) {
    await interaction.reply("You must be in a tracker channel to run this command")
    return;
  }
  await channel.permissionOverwrites.edit(invitedUser.id, { ViewChannel: true });
  await interaction.reply(`Invited @${invitedUser.globalName ?? invitedUser.username}`)
}