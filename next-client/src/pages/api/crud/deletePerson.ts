import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/lib/pgConnect";
import { Person, Session } from "@/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
  const person: Person | null = req.body.person || null;
  if (!person || !person.id || !person.list_id || !email) {
    console.log("Missing person or email", email, person);
    res.status(400).json("Missing id or email");
    return;
  }
  try {
    const verifyOwner = await sql({
      query: `
        SELECT * 
        FROM people_lists 
        WHERE owner_id = (SELECT id FROM users WHERE email = $1) AND id = $2;
        `,
      values: [email, person.list_id],
    });
    if (!verifyOwner.rows[0]) {
      res.status(401).json("Unauthorized");
      return;
    }

    const results = await sql({
      query: `
        DELETE FROM people
        WHERE id = $1 AND list_id = $2;
        `,
      values: [person.id, person.list_id],
    });

    res.status(200).json(results);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error deleting document: " + error);
    return;
  }
}
