import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/database/pgConnect";
import { User } from "@/utils/types";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const name = req.body.name || null;
  const email = req.body.email || null;
  const password = req.body.password || null;

  if (!password || !email || !name) {
    console.log("Missing password or email or name", JSON.stringify(req.body));
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
  if (user.hashed_password) {
    res.status(400).json("User already exists");
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    if (user) {
      await sql({
        query: `
            UPDATE users
            SET salt = $1, hashed_password = $2
            WHERE email = $3`,
        values: [salt, hash, email],
      });
      res.status(200).json("Success");
      return;
    } else {
      await sql({
        query: `
            INSERT INTO users (name, email, salt, hashed_password) 
            VALUES ($1, $2, $3, $4)`,
        values: [name, email, salt, hash],
      });
      res.status(200).json("Success");
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
