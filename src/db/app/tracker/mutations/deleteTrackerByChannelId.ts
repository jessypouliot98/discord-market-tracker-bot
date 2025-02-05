import { sqlClient } from "../../../sql/client.ts";
import { sql } from "../../../../utils/sql";

export async function deleteTrackerByChannelId(channelId: string) {
  await sqlClient.execute(sql`
    DELETE
    FROM tracker
    WHERE tracker.channel_id = ${channelId}
  `)
}