import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
        SELECT 
          pl.id,
          pl.name,
          json_agg(
            row_to_json(
              (SELECT tmp FROM (SELECT p.id, p.fname, p.mname, p.lname, p.image) tmp)
            )
          ) AS "people_in_list"
        FROM 
          people_lists pl
        JOIN 
          people_in_lists pil ON pl.id = pil.people_list_id
        JOIN 
          people p ON p.id = pil.people_id
        WHERE
          pl.owner_id = (SELECT id FROM users WHERE email = ${email})
        GROUP BY 
          pl.id, pl.name
        `;
        res.status(200).json(rows[0]);
        return;
      } else {
        const { rows } = await sql`
        SELECT 
          pl.id,
          pl.name,
          COALESCE(
            json_agg(
              CASE WHEN p.id IS NOT NULL THEN
                row_to_json(
                  (SELECT tmp FROM (SELECT p.id, p.fname, p.mname, p.lname, p.image) tmp)
                )
              ELSE
                NULL
              END
            ) FILTER (WHERE p.id IS NOT NULL),
            '[]'::json
          ) AS "people_in_list"
        FROM 
          people_lists pl
        LEFT JOIN 
          people_in_lists pil ON pl.id = pil.people_list_id
        LEFT JOIN 
          people p ON p.id = pil.people_id
        WHERE
          pl.owner_id = (SELECT id FROM users WHERE email = ${email})
          AND pl.id = ${listId}
        GROUP BY 
          pl.id, pl.name
        `;
        res.status(200).json(rows[0]);
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
