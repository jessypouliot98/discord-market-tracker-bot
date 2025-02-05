import { sqlClient } from "../../../sql/client.ts";
import { sql } from "../../../../utils/sql";
import { z } from "zod";
import { zTracker } from "../model.ts";

export async function queryAllTrackers() {
  const resultSet = await sqlClient.execute(sql`
    SELECT *
    FROM tracker
  `);
  return z.array(zTracker).parse(resultSet.rows);
}