import sql from "@/database/pgConnect";
import { User } from "../../utils/types";
import bcrypt from "bcrypt";

export default async function validatePassword({
  email,
}: {
  email: string;
}): Promise<User | null> {
  const { rows } = await sql({
    query: `
          SELECT *
          FROM users
          WHERE email = $1;
        `,
    values: [email],
  });
  const user = rows[0];

  if (!user) {
    return null;
  }
  return user;
}
