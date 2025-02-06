export const DISCORD_ID = String(Bun.env.DISCORD_ID);
export const DISCORD_TOKEN = String(Bun.env.DISCORD_TOKEN);
export const TURSO_URL = String(Bun.env.TURSO_URL);
export const TURSO_SYNC_URL = String(Bun.env.TURSO_SYNC_URL);
export const TURSO_AUTH_TOKEN = String(Bun.env.TURSO_AUTH_TOKEN);
export const SCRAPER_CRONTAB = Bun.env.SCRAPER_CRONTAB ?? "*/15 * * * *";