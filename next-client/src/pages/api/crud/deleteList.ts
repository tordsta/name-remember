import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/database/pgConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const email = session.user?.email || null;
    const id: string | null =
      typeof req.query.id === "string" && req.query.id.trim().length > 0
        ? req.query.id
        : null;
    if (!id || !email) {
      console.log("Missing id or email", id, email, JSON.stringify(req.body));
      res.status(400).json("Missing id or email");
      return;
    }
    try {
      const results = await sql({
        query: `
      WITH user_id AS (
        SELECT id FROM users WHERE email = $1
      )
      DELETE FROM people_lists
      WHERE id = $2 AND owner_id = (SELECT id FROM user_id)
      RETURNING id, name, owner_id;`,
        values: [email, id],
      });
      res.status(200).json(JSON.stringify(results));
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Error deleting document: " + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
