import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/database/pgConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
      console.log("delete person", id, email);
      const results = await sql({
        query: `
          SELECT delete_person($1, $2);
        `,
        values: [email, id],
      });

      console.log("results delete person", results);
      res.status(200).json(results);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Error deleting document: " + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
