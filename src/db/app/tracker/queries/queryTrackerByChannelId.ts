import { sqlClient } from "../../../sql/client.ts";
import { sql } from "../../../../utils/sql";
import { zTracker } from "../model.ts";

export async function queryTrackerByChannelId(channelId: string) {
  const result = await sqlClient.execute(sql`
    SELECT *
    FROM tracker
    WHERE tracker.channel_id = ${channelId}
    LIMIT 1
  `);
  return zTracker.optional().parse(result.rows[0]);
}