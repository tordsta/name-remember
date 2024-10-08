import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/lib/pgConnect";
import { Session } from "@/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session: Session | null | undefined = await getServerSession(
    req,
    res,
    authOptions as any
  );
  if (session) {
    const email = session.user?.email || null;
    const name: string | null =
      typeof req.query.name === "string" && req.query.name.trim().length > 0
        ? req.query.name
        : null;
    if (!name || !email) {
      console.log(
        "Missing name or email",
        name,
        email,
        JSON.stringify(req.body)
      );
      res.status(400).json("Missing name or email");
      return;
    }
    try {
      const results = await sql({
        query: `
      WITH user_id AS (
        SELECT id FROM users WHERE email = $1
      )
      INSERT INTO people_lists (owner_id, name, rrule, rrule_start, reminder_trigger_time)
      VALUES ((SELECT id FROM user_id), $2, 'DTSTART:20231014T180817Z
      RRULE:FREQ=WEEKLY;INTERVAL=1;BYHOUR=7;BYMINUTE=0;BYSECOND=0', NOW(), NOW() + INTERVAL '1 day')
      RETURNING id, name, owner_id;`,
        values: [email, name],
      });
      res.status(200).json(JSON.stringify(results));
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Error writing document: " + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
