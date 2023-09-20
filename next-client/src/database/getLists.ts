import sql from "@/database/pgConnect";
import { Session } from "next-auth";

export default async function getList({ session }: { session: Session }) {
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
      SELECT id FROM users WHERE email = ${email}
    )
    SELECT id, name, owner_id FROM people_lists WHERE owner_id = (SELECT id FROM user_id);`,
    });
    return rows;
  } catch (error) {
    throw new Error("Error querying people_lists" + error);
  }
}
