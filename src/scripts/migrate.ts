import { sqlClient } from "../db/sql/client.ts";
import { sql } from "../utils/sql";


async function run() {
  const results = await sqlClient.batch([
    sql`DROP TABLE IF EXISTS users`,
    sql`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`,
    sql`INSERT INTO users (name) VALUES ('Iku Turso')`
  ], "write");
  console.log(results)
}

await run();