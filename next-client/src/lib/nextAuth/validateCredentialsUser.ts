import sql from "@/lib/pgConnect";
import { SessionUser } from "../../utils/types";

export default async function validateCredentialsUser({
  email,
}: {
  email: string;
}): Promise<SessionUser | null | string> {
  const { rows } = await sql({
    query: `
          SELECT *
          FROM users
          WHERE email = $1;
        `,
    values: [email],
  });
  if (!rows[0]) {
    return "User does not exist. You must create a user before you sign in.";
  }
  if (rows[0].email_verified === false) {
    return "Email not verified.";
  }
  if (!rows[0].hashed_password) {
    return "Log in with a provider, go to your profile and set a password there.";
  }

  const sessionUser = {
    id: rows[0].id,
    email: rows[0].email,
    email_verified: rows[0].email_verified,
  };

  return sessionUser;
}
