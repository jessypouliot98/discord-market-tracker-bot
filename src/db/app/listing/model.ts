import { z } from "zod";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { tableTracker } from "../tracker/model.ts";

export const tableListing = sqliteTable(
  "listing",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    tracker_id: integer().notNull().references(() => tableTracker.id, {
      onDelete: "cascade",
      onUpdate: "cascade"
    }),
    listing_id: text().notNull(),
    title: text().notNull(),
    price: text().notNull(),
    location: text(),
    url: text().notNull(),
    thumbnail_url: text(),
  },
  (t) => [
    unique("tracker_listing").on(t.tracker_id, t.listing_id)
  ]
);

export const zListing = z.object({
  id: z.number(),
  tracker_id: z.number(),
  listing_id: z.string(),
  title: z.string(),
  price: z.string(),
  location: z.string().nullish(),
  url: z.string().url(),
  thumbnail_url: z.string().url().nullish(),
});

export type Listing = z.infer<typeof zListing>;