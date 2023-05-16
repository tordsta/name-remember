import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
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
      const results = await sql`
      WITH user_id AS (
        SELECT id FROM users WHERE email = ${email}
      )
      INSERT INTO people_lists (name, owner_id)
      VALUES (${name}, (SELECT id FROM user_id))
      RETURNING id, name, owner_id;`;
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
