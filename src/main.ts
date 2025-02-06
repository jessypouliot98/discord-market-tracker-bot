import { registerCommands } from "./discord/commands/registerCommands.ts";
import { authenticateClient, createClient, setupClientCommands } from "./discord/client.ts";
import cron from "node-cron";
import { SCRAPER_CRONTAB } from "./utils/env.ts";
import { browserPromise } from "./browser.ts";
import { queryAllTrackers } from "./db/app/tracker/queries/queryAllTrackers.ts";
import { scrapeTracker } from "./scrapper/scrapeTracker.ts";

async function main() {
  console.clear();
  console.log("Market Tracker bot starting up...")
  void registerCommands();
  const discordClient = createClient();
  setupClientCommands(discordClient);
  await authenticateClient(discordClient);
  cron.schedule(SCRAPER_CRONTAB, async () => {
    console.log(`[SCRAPER CRON TASK] Started at ${new Date().toISOString()}`)
    const browser = await browserPromise;
    const page = await browser.newPage();
    for (const tracker of await queryAllTrackers()) {
      await scrapeTracker({
        tracker,
        discordClient,
        page
      });
    }
    await page.close();
  });
}

await main();
