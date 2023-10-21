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
    if (!email || !person || !person.id || !person.list_id) {
      console.log(
        "Missing person or email",
        email,
        person?.id,
        person?.fname,
        person?.mname,
        person?.lname
      );
      res.status(400).json("Missing name or email");
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
      const people = await sql({
        query: `
        UPDATE people
        SET fname = $1, mname = $2, lname = $3, image = $4
        WHERE id = $5 AND list_id = $6;`,
        values: [
          person.fname || "",
          person.mname || "",
          person.lname || "",
          person.image || "",
          person.id,
          person.list_id,
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
