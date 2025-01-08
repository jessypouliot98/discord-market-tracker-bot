import { type CacheType, type Interaction } from "discord.js";

export const commands = {
  ping: {
    description: 'Replies with Pong!',
    action: async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await interaction.reply("Pong!");
    }
  }
} satisfies Record<string, {
  description: string;
  action?: (interaction: Interaction<CacheType>) => void;
}>;