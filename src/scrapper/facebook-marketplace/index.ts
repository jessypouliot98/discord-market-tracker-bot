import type { Page } from "playwright";
import type { Tracker } from "../../db/app/tracker/model.ts";
import type { Listing } from "../../db/app/listing/model.ts";

export async function scrapeFacebookMarketplace(page: Page, tracker: Tracker) {
  await page.goto(tracker.url);

  const collectionLocator = page.locator("[aria-label='Collection of Marketplace items']");
  const itemsLocator = collectionLocator.locator("[role=link]");
  const items = await itemsLocator.all();

  const listings: Array<Omit<Listing, "id" | "tracker_id">> = [];

  for (const item of items) {
    type Data = Pick<Listing, "url" | "title" | "price" | "location" | "thumbnail_url">
    const data = await item.evaluate<Data, HTMLAnchorElement>((node) => {
      return {
        url: node.href,
        title: node.querySelector("div.x9f619.x78zum5.xdt5ytf.x1qughib.x1rdy4ex.xz9dl7a.xsag5q8.xh8yej3.xp0eagm.x1nrcals > div:nth-child(2) > span > div > span > span")?.textContent ?? "[no-title]",
        price: node.querySelector("div.x9f619.x78zum5.xdt5ytf.x1qughib.x1rdy4ex.xz9dl7a.xsag5q8.xh8yej3.xp0eagm.x1nrcals > div:nth-child(1) > span > div > span")?.textContent ?? "[no-price]",
        location: node.querySelector("div.x9f619.x78zum5.xdt5ytf.x1qughib.x1rdy4ex.xz9dl7a.xsag5q8.xh8yej3.xp0eagm.x1nrcals > div:nth-child(3) > span > div > span > span")?.textContent ?? "[no-location]",
        thumbnail_url: node.querySelector("img")?.getAttribute("src") ?? null,
      }
    });
    const matches = data.url.match(/marketplace\/item\/(\d+)/);
    if (!matches) throw Error();
    const [_, listingId] = matches;

    listings.push(
      Object.assign(data, {
        listing_id: listingId,
      })
    )
  }
  return listings;
}