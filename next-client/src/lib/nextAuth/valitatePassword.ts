import sql from "@/database/pgConnect";
import crypto from "crypto";
import { User } from "../../utils/types";

export default async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null | undefined> {
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
    console.log("Incorrect username or password.");
    return null;
  }

  crypto.pbkdf2(
    password,
    user.salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        console.log(err);
        return null;
      }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        console.log("Incorrect username or password.");
        return null;
      }
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        verified_email: user.email_verified,
        image: user.image,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        subscription_plan: user.subscription_plan,
        stripe_customer_id: user.stripe_customer_id,
      };
    }
  );
}
