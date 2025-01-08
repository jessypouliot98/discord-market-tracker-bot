import { Client, GatewayIntentBits, type Interaction } from "discord.js";
import { commands } from "./commands/commands.ts";
import { DISCORD_TOKEN } from "../utils/env.ts";

export function createClient() {
  return new Client({ intents: [GatewayIntentBits.Guilds] });
}

export async function authenticateClient(client: Client) {
  return new Promise<void>((resolve, reject) => {
    client.once("ready", () => {
      console.log(`${client.user?.tag} authenticated!`);
      resolve();
    });
    client.once("error", (error) => {
      console.error(error);
      reject(error)
    });
    client.login(DISCORD_TOKEN);
  })
}

export function setupClientCommands(client: Client) {
  const handler = async (interaction: Interaction) => {
    if (!("commandName" in interaction)) return;
    if (!(interaction.commandName in commands)) return;
    const command = commands[interaction.commandName as keyof typeof commands];
    if (!("action" in command)) return;
    await command.action(interaction);
  }
  client.on("interactionCreate", handler);
  return () => client.off("interactionCreate", handler);
}