import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/lib/pgConnect";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import validatePassword from "@/lib/nextAuth/validatePassword";
import { authOptions } from "./[...nextauth]";
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
  if (!session || !session.user || !session.user.email) {
    res.status(401).json("Unauthorized");
    return;
  }
  const email = session.user.email;
  const oldPassword: string | null = req.body.oldPassword || null;
  const newPassword: string | null = req.body.newPassword || null;

  if (!newPassword || !email) {
    res.status(400).json("Missing password or email or name");
    return;
  }

  try {
    const { rows } = await sql({
      query: `
            SELECT *
            FROM users
            WHERE email = $1;
          `,
      values: [email],
    });
    if (!rows[0]) {
      res.status(404).json("User not found");
      return;
    }

    //If the user has a password set, check if the old password is correct
    //If the user does not have a password set, allow the user to set a password
    if (rows[0].hashed_password !== null) {
      if (!oldPassword) {
        res.status(401).json("Wrong password");
        return;
      }
      const validatedPassword = await validatePassword({
        email,
        password: oldPassword,
      });
      if (!validatedPassword) {
        res.status(401).json("Wrong password");
        return;
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    await sql({
      query: `
            UPDATE users
            SET hashed_password = $1
            WHERE email = $2`,
      values: [hash, email],
    });
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
    return;
  }
}
