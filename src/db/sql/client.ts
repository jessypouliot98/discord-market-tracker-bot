import { createClient } from "@libsql/client";
import { TURSO_AUTH_TOKEN, TURSO_SYNC_URL, TURSO_URL } from "../../utils/env.ts";

export const sqlClient = createClient({
  url: TURSO_URL,
  // syncUrl: TURSO_SYNC_URL,
  // authToken: TURSO_AUTH_TOKEN,
});