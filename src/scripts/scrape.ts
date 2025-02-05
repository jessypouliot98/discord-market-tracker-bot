import { chromium } from "playwright";
import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";
import { z } from "zod";
import { zTracker } from "../db/app/tracker/model.ts";
import { authenticateClient, createClient } from "../discord/client.ts";
import { scrapeTracker } from "../scrapper/scrapeTracker.ts";

const discordClient = createClient();
await authenticateClient(discordClient);
const browser = await chromium.launch({});

const resultSet = await sqlClient.execute(sql`
  SELECT *
  FROM tracker
`);
const trackers = z.array(zTracker).parse(resultSet.rows);

const page = await browser.newPage();

for (const tracker of trackers) {
  await scrapeTracker({
    tracker,
    discordClient,
    page
  });
}

await browser.close();