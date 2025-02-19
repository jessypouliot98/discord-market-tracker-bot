import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";
import { TURSO_URL } from "./src/utils/env.ts";

function getSchemas() {
  const appDir = path.resolve(__dirname, "./src/db/app");
  const entities = fs.readdirSync(appDir);
  return entities.map((entity) => path.resolve(appDir, entity, "model.ts"))
}

export default defineConfig({
  dialect: "turso",
  schema: getSchemas(),
  out: "./src/db/migrations",
  dbCredentials: {
    url: TURSO_URL,
  }
});
