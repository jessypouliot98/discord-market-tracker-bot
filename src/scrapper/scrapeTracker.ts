import { type Page } from "playwright";
import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";
import { type Tracker } from "../db/app/tracker/model.ts";
import { scrapeFacebookMarketplace } from "./facebook-marketplace";
import type { Listing } from "../db/app/listing/model.ts";
import { type Client, EmbedBuilder, Message } from "discord.js";

export async function scrapeTracker(params: {
  tracker: Tracker;
  page: Page;
  discordClient: Client
}) {
  const { tracker, page, discordClient } = params;
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

  for (const listing of listings) {
    if (!listing.thumbnail_url) throw new Error(`No thumbnail URL found for tracker ${tracker.id}`);

    const sqlTransaction = await sqlClient.transaction("write");
    let message: Message | undefined;
    try {
      await sqlTransaction.execute(sql`
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

      const imageEmbed = new EmbedBuilder()
        .setImage(listing.thumbnail_url)
      message = await channel.send({
        content: [
          `[${listing.title}](${listing.url})`,
          listing.price,
          listing.location,
        ].join("\n"),
        embeds: [imageEmbed],
      });

      await sqlTransaction.commit();
      console.log(`Added listing:${listing.listing_id}`);
    } catch (error) {
      console.log(`Skipped listing:${listing.listing_id}`);
      await Promise.all([
        await message?.delete(),
        await sqlTransaction.rollback(),
      ])
    }
  }
}