import { registerCommands } from "./discord/commands/registerCommands.ts";
import { authenticateClient, createClient, setupClientCommands } from "./discord/client.ts";

async function main() {
  console.clear();
  console.log("Market Tracker bot starting up...")
  void registerCommands();
  const discordClient = createClient();
  setupClientCommands(discordClient);
  await authenticateClient(discordClient);
}

await main();
