import sql from "@/database/pgConnect";
import { User } from "../../utils/types";
import bcrypt from "bcrypt";

export default async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
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

  const validated = await bcrypt.compare(password, user.hashed_password);
  if (!validated) {
    return null;
  } else {
    //To expand the session user object add more information here. (and in customAuthAdapter.ts)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified: user.email_verified,
      image: user.image,
      subscription_plan: user.subscription_plan,
    };
  }
}
