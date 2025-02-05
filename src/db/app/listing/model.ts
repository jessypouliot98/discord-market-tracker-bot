import { z } from "zod";
import { model } from "../../schema-generator";

export const zListing = z.object({
  id: model.pkey(),
  tracker_id: z.number(),
  listing_id: z.string(),
  title: z.string(),
  price: z.string(),
  location: z.string().nullish(),
  url: z.string().url(),
});

export type Listing = z.infer<typeof zListing>;