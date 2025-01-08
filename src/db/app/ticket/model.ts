import { z } from "zod";
import { model } from "../../schema-generator";
import { zTracker } from "../tracker/model.ts";

const trackerShape = zTracker.shape;

export const zTicket = z.object({
  id: model.pkey(),
  channelId: z.string(),
  name: trackerShape.name.nullish(),
  type: trackerShape.type.nullish(),
  url: trackerShape.url.nullish(),
});