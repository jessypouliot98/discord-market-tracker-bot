import { sqlClient } from "../../sql/client.ts";
import { sql } from "../../../utils/sql";
import { z } from "zod";
import { zListing } from "./model.ts";

export async function queryTrackedListingsByMatchingIds(trackerId: number, listingIds: string[]) {
  const result = await sqlClient.execute(sql`
    SELECT DISTINCT listing_id
    FROM listing
    WHERE listing.tracker_id = ${trackerId}
    AND listing.listing_id IN (
      ${{ raw: listingIds.map((id) => `'${id}'`).join(",") }}
    )
  `);
  return z.array(zListing.pick({ listing_id: true })).parse(result.rows);
}