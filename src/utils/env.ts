export const DISCORD_ID = String(process.env.DISCORD_ID);
export const DISCORD_TOKEN = String(process.env.DISCORD_TOKEN);
export const TURSO_URL = String(process.env.TURSO_URL);
export const TURSO_SYNC_URL = String(process.env.TURSO_SYNC_URL);
export const TURSO_AUTH_TOKEN = String(process.env.TURSO_AUTH_TOKEN);
export const SCRAPER_CRONTAB = process.env.SCRAPER_CRONTAB ?? "*/15 * * * *";