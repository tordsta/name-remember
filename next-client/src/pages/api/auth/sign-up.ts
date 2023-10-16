import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/lib/pgConnect";
import { User } from "@/utils/types";
import bcrypt from "bcrypt";
import { create } from "domain";
import createWelcomeList from "@/utils/createWelcomeList";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const name = req.body.name || null;
  const email = req.body.email || null;
  const password = req.body.password || null;

  if (!password || !email || !name) {
    res.status(400).json("Missing password or email or name");
    return;
  }

  const { rows } = await sql({
    query: `
            SELECT *
            FROM users
            WHERE email = $1;
            `,
    values: [email],
  });
  const user: User = rows[0];
  if (user && user.email_verified) {
    res
      .status(400)
      .json(
        "User already exists. Log in with your provider and create a password in your profile."
      );
    return;
  }
  if (user && !user.email_verified) {
    res.status(400).json("User already exists. Please verify your email.");
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    const { rows } = await sql({
      query: `
            INSERT INTO users (name, email, hashed_password) 
            VALUES ($1, $2, $3)
            RETURNING id;`,
      values: [name, email, hash],
    });
    createWelcomeList({ userId: rows[0].id });
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
    return;
  }
}
