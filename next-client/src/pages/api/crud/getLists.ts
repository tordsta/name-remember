import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);
  if (session) {
    const email = session.user?.email || null;
    if (!email) {
      console.log("Missing email", email);
      res.status(400).json("Missing email");
      return;
    }
    try {
      const { rows } = await sql`
      WITH user_id AS (
        SELECT id FROM users WHERE email = ${email}
      )
      SELECT id, name, owner_id FROM people_lists WHERE owner_id = (SELECT id FROM user_id);`;
      res.status(200).json(JSON.stringify(rows));
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Error querying people_lists" + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
