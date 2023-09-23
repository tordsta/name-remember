import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/database/pgConnect";
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
      const people = await sql({
        query: `
        INSERT INTO people (fname, mname, lname, image)
        VALUES ($1, $2, $3, $4)
        RETURNING id, fname;`,
        values: [person.fname, person.mname, person.lname, person.image],
      });

      const results = await sql({
        query: `
      WITH user_id AS (
        SELECT id 
        FROM users 
        WHERE email = $1
      ), 
      list_id AS (
        SELECT id 
        FROM people_lists 
        WHERE id = $2
        AND owner_id = (SELECT id FROM user_id)
      )
      INSERT INTO people_in_lists (people_id, people_list_id)
      VALUES ($3, (SELECT id FROM list_id))`,
        values: [email, listId, people.rows[0].id],
      });
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
