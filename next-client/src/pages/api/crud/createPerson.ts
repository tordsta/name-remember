import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/lib/pgConnect";
import { Person } from "@/utils/types";
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
    const person: Person | null = req.body.person || null;
    const listId: string | null = req.body.listId || null;
    if (!person || !listId || !email) {
      console.log(
        "Missing person or id or email",
        person,
        email,
        JSON.stringify(req.body)
      );
      res.status(400).json("Missing name or email");
      return;
    }
    try {
      const verifyOwner = await sql({
        query: `
        SELECT id FROM people_lists WHERE owner_id = (SELECT id FROM users WHERE email = $1) AND id = $2;
        `,
        values: [email, listId],
      });
      if (!verifyOwner.rows[0]) {
        res.status(401).json("Unauthorized");
        return;
      }

      const people = await sql({
        query: `
        INSERT INTO people (fname, mname, lname, image, image_url, list_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, fname;`,
        values: [
          person.fname,
          person.mname,
          person.lname,
          person.image,
          person.image_url,
          listId,
        ],
      });
      res.status(200).json(JSON.stringify(people.rows[0]));
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Error writing document: " + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
