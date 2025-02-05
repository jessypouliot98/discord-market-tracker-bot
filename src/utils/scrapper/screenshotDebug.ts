import type { Page } from "playwright";
import * as path from "node:path";

export async function screenshotDebug(page: Page, name: string) {
  await page.screenshot({
    path: path.join(process.cwd(), `.debug/${name}.png`),
    fullPage: true,
  });

}