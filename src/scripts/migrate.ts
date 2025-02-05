import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";
import { createTableFromSchema } from "../db/schema-generator";
import { zTracker } from "../db/app/tracker/model.ts";

async function run() {
  const results = await sqlClient.batch([
    sql`DROP TABLE IF EXISTS tracker`,
    createTableFromSchema("tracker", zTracker),
  ], "write");
  for (const result of results) {
    console.log(result.toJSON())
  }
}

await run();