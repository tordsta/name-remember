import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const email = session.user?.email || null;
    const listId: string | null =
      typeof req.query.id === "string" ? req.query.id : null;
    if (!email) {
      res.status(400).json("Missing email or list id!");
      return;
    }
    try {
      if (
        !listId ||
        listId === "null" ||
        listId === "undefined" ||
        listId === ""
      ) {
        const { rows } = await sql`
        WITH user_id AS (
          SELECT id FROM users WHERE email = ${email}
          )
          SELECT *
          FROM people_lists 
          WHERE owner_id = (SELECT id FROM user_id);`;
        res.status(200).json(JSON.stringify(rows[0]));
        return;
      } else {
        const { rows } = await sql`
        WITH user_id AS (
          SELECT id FROM users WHERE email = ${email}
          )
          SELECT *
          FROM people_lists 
          WHERE owner_id = (SELECT id FROM user_id) AND id = ${listId};`;
        res.status(200).json(JSON.stringify(rows[0]));
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Error querying people_lists" + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
