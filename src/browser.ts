import { chromium } from "playwright";

export const browserPromise = chromium.launch();