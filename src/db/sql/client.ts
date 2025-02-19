import { createClient } from "@libsql/client";
import { TURSO_AUTH_TOKEN, TURSO_SYNC_URL, TURSO_URL } from "../../utils/env.ts";
import { drizzle } from "drizzle-orm/libsql";

export const sqlClient = createClient({
  url: TURSO_URL,
  // syncUrl: TURSO_SYNC_URL,
  // authToken: TURSO_AUTH_TOKEN,
});

export const drizzleClient = drizzle(sqlClient);