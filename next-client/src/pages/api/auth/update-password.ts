import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/database/pgConnect";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import validateUser from "@/lib/nextAuth/validateUser";
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
  const oldPassword = req.body.oldPassword || null;
  const newPassword = req.body.newPassword || null;

  if (!newPassword || !email) {
    res.status(400).json("Missing password or email or name");
    return;
  }

  try {
    const validatedUser = await validateUser({ email });
    if (!validatedUser) {
      res.status(404).json("User not found");
      return;
    }
    if (validatedUser.hashed_password !== null) {
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
            SET salt = $1, hashed_password = $2
            WHERE email = $3`,
      values: [salt, hash, email],
    });
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
    return;
  }
}
