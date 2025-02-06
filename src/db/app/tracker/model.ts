import { z } from "zod";
import { model } from "../../schema-generator";

export const zTracker = z.object({
  id: model.pkey(),
  name: z.string(),
  type: z.enum(["facebook-marketplace"]),
  url: z.string().url(),
  channel_id: z.string(),
  owner_id: z.string(),
});

export type Tracker = z.infer<typeof zTracker>;