import { authenticateClient, createClient } from "../discord/client.ts";
import { scrapeTracker } from "../scrapper/scrapeTracker.ts";
import { browserPromise } from "../browser.ts";
import { queryAllTrackers } from "../db/app/tracker/queries/queryAllTrackers.ts";

const discordClient = createClient();
await authenticateClient(discordClient);
const browser = await browserPromise;

const page = await browser.newPage();

for (const tracker of await queryAllTrackers()) {
  await scrapeTracker({
    tracker,
    discordClient,
    page
  });
}

await browser.close();