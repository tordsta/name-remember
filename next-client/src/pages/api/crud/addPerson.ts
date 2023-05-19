import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";
import { Person } from "@/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const email = session.user?.email || null;
    const person: Person | null = req.body.person || null;
    const listId: string | null = req.body.listId || null;
    console.log("person", person, listId, email);
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
      //add image later
      const people = await sql`
        INSERT INTO people (fname)
        VALUES (${person.fname})
        RETURNING id, fname;`;

      const results = await sql`
      WITH user_id AS (
        SELECT id 
        FROM users 
        WHERE email = ${email}
      ), 
      list_id AS (
        SELECT id 
        FROM people_lists 
        WHERE id = ${listId} 
        AND owner_id = (SELECT id FROM user_id)
      )
      INSERT INTO people_in_lists (people_id, people_list_id)
      VALUES (${people.rows[0].id}, (SELECT id FROM list_id))`;
      res.status(200).json(JSON.stringify(results.rowCount));
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json("Error writing document: " + error);
      return;
    }
  }
  res.status(401).json("Unauthorized");
}
