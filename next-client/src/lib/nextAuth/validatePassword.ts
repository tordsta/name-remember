import sql from "@/lib/pgConnect";
import { SessionUser, User } from "../../utils/types";
import bcrypt from "bcrypt";

export default async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SessionUser | null> {
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

  const validated = await bcrypt.compare(password, user.hashed_password);
  if (!validated) {
    return null;
  } else {
    //To expand the session user object add more information here. (and in customAuthAdapter.ts)
    return {
      id: user.id,
      email: user.email,
      email_verified: user.email_verified,
    };
  }
}
