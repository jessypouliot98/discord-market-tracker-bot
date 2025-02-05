import type { Page } from "playwright";
import type { Tracker } from "../../db/app/tracker/model.ts";
import { screenshotDebug } from "../../utils/scrapper/screenshotDebug.ts";
import type { Listing } from "../../db/app/listing/model.ts";

export async function scrapeFacebookMarketplace(page: Page, tracker: Tracker) {
  await page.goto(tracker.url);

  await screenshotDebug(page, "a");
  await page.click("[role=dialog] [aria-label=Close]");
  await screenshotDebug(page, "b");

  const collectionLocator = page.locator("[aria-label='Collection of Marketplace items']");
  const itemsLocator = collectionLocator.locator("[role=link]");
  const items = await itemsLocator.all();

  const listings: Array<Omit<Listing, "id" | "tracker_id">> = [];

  for (const item of items) {
    type Data = Pick<Listing, "url" | "title" | "price" | "location" | "thumbnail_url">
    const data = await item.evaluate<Data, HTMLAnchorElement>((node) => {
      const classSelector = (classNames: string) => "." + classNames.split(" ").join(".");
      return {
        url: node.href,
        title: node.querySelector(classSelector("x1lliihq x6ikm8r x10wlt62 x1n2onr6"))?.textContent ?? "[no-title]",
        price: node.querySelector(classSelector("x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x3x7a5m x1lkfr7t x1lbecb7 x1s688f xzsf02u"))?.textContent ?? "[no-title]",
        location: node.querySelector(classSelector("x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft"))?.textContent ?? "[no-title]",
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