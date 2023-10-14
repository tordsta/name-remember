import sql from "@/lib/pgConnect";
import { Session } from "next-auth";

export default async function getList({
  listId,
  session,
}: {
  listId: string;
  session: Session;
}) {
  if (typeof window !== "undefined") {
    throw new Error("Database functions should not be executed on the client");
  }

  if (!session) throw new Error("No session found!");
  const email = session.user?.email || null;
  if (!email || !listId) throw new Error("Missing email or list id!");

  try {
    if (
      !listId ||
      listId === "null" ||
      listId === "undefined" ||
      listId === ""
    ) {
      const { rows } = await sql({
        query: `
        SELECT 
          pl.id,
          pl.name,
          pl.rrule,
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
          pl.owner_id = (SELECT id FROM users WHERE email = $1)
        GROUP BY 
          pl.id, pl.name
        `,
        values: [email],
      });
      return rows[0];
    } else {
      const { rows } = await sql({
        query: `
        SELECT 
          pl.id,
          pl.name,
          pl.rrule,
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
          pl.owner_id = (SELECT id FROM users WHERE email = $1)
          AND pl.id = $2
        GROUP BY 
          pl.id, pl.name
        `,
        values: [email, listId],
      });
      return rows[0];
    }
  } catch (error) {
    throw new Error("Error querying people_lists" + error);
  }
}
