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
  if (!session) {
    res.status(401).json("Unauthorized");
    return;
  }

  const email = session.user?.email || null;
  const listId: string | null = req.body.listId || null;

  if (!listId || !email) {
    console.log(
      "Missing variables in deleteReminder",
      JSON.stringify(req.body)
    );
    res.status(400).json("Missing variables");
    return;
  }
  try {
    const { rows } = await sql({
      query: `
        UPDATE people_lists 
        SET rrule = NULL, 
            rrule_start = NULL, 
            reminder_trigger_time = NULL
        WHERE ID = $1 
            AND owner_id = (SELECT id FROM users WHERE email = $2)
    `,
      values: [listId, email],
    });
    res.status(200).json(rows[0] as any);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
