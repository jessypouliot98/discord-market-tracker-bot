import { REST, Routes } from "discord.js";
import { DISCORD_ID, DISCORD_TOKEN } from "../../utils/env.ts";
import { commands } from "./commands.ts";

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

export async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');
    const body = Object.entries(commands)
      .map(([name, { description }]) => ({ name, description }));
    await rest.put(Routes.applicationCommands(DISCORD_ID), { body });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}