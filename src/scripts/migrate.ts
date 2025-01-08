import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";
import { createTableFromSchema } from "../db/schema-generator";
import { zTracker } from "../db/app/tracker/model.ts";
import { zTicket } from "../db/app/ticket/model.ts";

async function run() {
  const results = await sqlClient.batch([
    sql`DROP TABLE IF EXISTS tracker`,
    sql`DROP TABLE IF EXISTS ticket`,
    createTableFromSchema("tracker", zTracker),
    createTableFromSchema("ticket", zTicket),
  ], "write");
  console.log(results)
}

await run();