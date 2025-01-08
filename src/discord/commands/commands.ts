import { type CacheType, type Interaction } from "discord.js";
import { sqlClient } from "../../db/sql/client.ts";
import { sql } from "../../utils/sql";

export const commands = {
  ping: {
    description: 'Replies with Pong!',
    action: async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await interaction.reply("Pong!");
    }
  },
  track: {
    description: "Add a tracker",
    action: async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      if (!interaction.guild) {
        await interaction.reply(`Uh oh! No permissions for guild?`)
        return;
      }
      const newChannel = await interaction.guild.channels.create({
        name: "Create Channel",
      });
      await sqlClient.execute(sql`
        INSERT INTO tickets (channelId)
        VALUES (${newChannel.id})
      `);
      await interaction.reply(`Channel created #${newChannel.id}`)
    }
  }
} satisfies Record<string, {
  description: string;
  action?: (interaction: Interaction<CacheType>) => void;
}>;