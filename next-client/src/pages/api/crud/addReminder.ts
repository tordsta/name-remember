import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/database/pgConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Unauthorized");
    return;
  }

  const email = session.user?.email || null;
  const rrule: string | null = req.body.rrule || null;
  const rruleStart: number | null = req.body.rruleStart || null;
  const nextReminder: number | null = req.body.nextReminder || null;
  const listId: string | null = req.body.listId || null;

  if (!rrule || !rruleStart || !listId || !email) {
    console.log("Missing variables in addReminder", JSON.stringify(req.body));
    res.status(400).json("Missing variables");
    return;
  }
  try {
    const { rows } = await sql({
      query: `
        UPDATE people_lists 
        SET rrule = ${rrule}, 
            rrule_start = to_timestamp(${rruleStart}), 
            reminder_trigger_time = to_timestamp(${nextReminder})
        WHERE ID = ${listId} 
            AND owner_id = (SELECT id FROM users WHERE email = ${email})
    `,
    });

    console.log("rows update rrule", rows);
    res.status(200).json(rows[0] as any);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
