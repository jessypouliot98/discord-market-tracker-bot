import {
  Client,
  type Interaction,
  SlashCommandBuilder
} from "discord.js";
import { queryTrackerByChannelId } from "../../../db/app/tracker/queries/queryTrackerByChannelId.ts";
import { SCRAPER_CRONTAB } from "../../../utils/env.ts";

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
    `your_user_id: ${interaction.user.id}`,
    `guild_id: ${guild.id}`,
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

  builder.push(`scraper_cron_tab: ${SCRAPER_CRONTAB}`)

  await interaction.reply({
    content: builder.join("\n"),
    embeds: [],
  })
}