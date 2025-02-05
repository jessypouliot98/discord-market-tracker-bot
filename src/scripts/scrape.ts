import { chromium } from "playwright";
import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";
import { z } from "zod";
import { zTracker } from "../db/app/tracker/model.ts";
import { scrapeFacebookMarketplace } from "../scrapper/facebook-marketplace";
import type { Listing } from "../db/app/listing/model.ts";
import { authenticateClient, createClient, setupClientCommands } from "../discord/client.ts";
import { queryTrackedListingsByMatchingIds } from "../db/app/listing/query-tracked-listings-by-matching-ids.ts";
import { EmbedBuilder } from "discord.js";

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
  let listings: Array<Omit<Listing, "id" | "tracker_id">>;

  if (tracker.type === "facebook-marketplace") {
    listings = await scrapeFacebookMarketplace(page, tracker);
  } else {
    listings = [];
    console.warn(`Tracker type ${tracker.type} is not supported`);
  }

  const channel = await discordClient.channels.fetch(tracker.channel_id);
  if (!channel) throw new Error(`No channel found for tracker ${tracker.id}`);
  if (!channel.isSendable()) throw new Error(`No channel found for tracker ${tracker.id}`);

  const prevListings = await queryTrackedListingsByMatchingIds(
    tracker.id!,
    listings.map((l) => l.listing_id)
  );
  const setListings = new Set(prevListings.map((l) => l.listing_id));

  for (const listing of listings) {
    if (setListings.has(listing.listing_id)) {
      console.log(`Skipping listing:${listing.listing_id}`);
      continue;
    }
    console.log(`Adding listing:${listing.listing_id}`);
    setListings.add(listing.listing_id);

    if (!listing.thumbnail_url) throw new Error(`No thumbnail URL found for tracker ${tracker.id}`);
    const imageEmbed = new EmbedBuilder()
      .setImage(listing.thumbnail_url)

    await channel.send({
      content: [
        `[${listing.title}](${listing.url})`,
        listing.price,
        listing.location,
      ].join("\n"),
      embeds: [imageEmbed],
    });

    await sqlClient.execute(sql`
      INSERT INTO listing (tracker_id, listing_id, title, price, location, url)
      VALUES (
        ${tracker.id},
        ${listing.listing_id},
        ${listing.title},
        ${listing.price},
        ${listing.location},
        ${listing.url}
      )
    `);
  }
}

await browser.close();