import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";
import { createTableFromSchema } from "../db/schema-generator";
import { zTracker } from "../db/app/tracker/model.ts";
import { zListing } from "../db/app/listing/model.ts";

async function run() {
  const results = await sqlClient.batch([
    sql`DROP TABLE IF EXISTS tracker`,
    sql`DROP TABLE IF EXISTS listing`,
    createTableFromSchema("tracker", zTracker),
    createTableFromSchema("listing", zListing),
  ], "write");
  for (const result of results) {
    console.log(result.toJSON())
  }
}

await run();