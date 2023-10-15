import sql from "@/lib/pgConnect";
import { Session } from "next-auth";

export default async function getLists({ session }: { session: Session }) {
  if (typeof window !== "undefined") {
    throw new Error("Database functions should not be executed on the client");
  }

  if (!session) throw new Error("No session found!");
  const email = session.user?.email || null;
  if (!email) throw new Error("Missing email or list id!");

  try {
    const { rows } = await sql({
      query: `
    WITH user_id AS (
      SELECT id FROM users WHERE email = $1
    )
    SELECT 
      pl.id, 
      pl.name, 
      pl.owner_id, 
      pl.rrule,
      COALESCE(COUNT(p.list_id), 0) AS people_in_lists_count 
    FROM people_lists pl
    LEFT JOIN people p ON pl.id = p.list_id
    WHERE pl.owner_id = (SELECT id FROM user_id)
    GROUP BY pl.id, pl.name, pl.owner_id, pl.rrule;`,
      values: [email],
    });
    return rows;
  } catch (error) {
    throw new Error("Error querying people_lists" + error);
  }
}
