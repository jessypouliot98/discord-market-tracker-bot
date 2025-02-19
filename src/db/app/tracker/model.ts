import { z } from "zod";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const zTrackerType = z.enum(["facebook-marketplace"]);
export type TrackerType = z.infer<typeof zTrackerType>;

export const tableTracker = sqliteTable("tracker", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text().$type<TrackerType>().notNull(),
  type: text().notNull(),
  url: text().notNull(),
  channel_id: text().notNull(),
  owner_id: text().notNull(),
});

export const zTracker = z.object({
  id: z.number(),
  name: z.string(),
  type: zTrackerType,
  url: z.string().url(),
  channel_id: z.string(),
  owner_id: z.string(),
});

export type Tracker = z.infer<typeof zTracker>;