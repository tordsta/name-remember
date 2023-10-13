import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/database/pgConnect";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const email = null; //get from session
  const password = req.body.password || null;

  if (!password || !email) {
    res.status(400).json("Missing password or email or name");
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
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
