import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/lib/pgConnect";
import { v4 as uuidv4 } from "uuid";
import sendResetPasswordEmail from "@/lib/postmarkEmail/sendResetPasswordMail";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const email = req.body.email || null;
  const token = req.body.token || null;
  const password = req.body.password || null;

  if (!email) {
    res.status(400).json("Missing email");
    return;
  }

  try {
    if (email && !token) {
      const newToken = uuidv4();
      const { rows } = await sql({
        query: `
        INSERT INTO verification_tokens (email, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '1 hour')
        RETURNING *;
        `,
        values: [email, newToken],
      });
      if (rows.length === 0) {
        res.status(500).json("Error: token not created");
        return;
      }

      await sendResetPasswordEmail({
        recipientEmail: email,
        recipientName: email,
        tokenUrl: `${process.env.NEXTAUTH_URL}/reset-password?email=${email}&token=${newToken}`,
      });

      res.status(200).json("Success");
    }

    if (email && token && password) {
      const { rows } = await sql({
        query: `
        UPDATE verification_tokens
        SET consumed_at = NOW()
        WHERE email = $1 AND token = $2 AND expires_at > NOW() AND consumed_at IS NULL
        RETURNING *;
        `,
        values: [email, token],
      });
      if (rows.length === 0) {
        res.status(500).json("Error: token not found or token expired");
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      await sql({
        query: `
                UPDATE users
                SET salt = $1, hashed_password = $2
                WHERE email = $3`,
        values: [salt, hash, email],
      });
      res.status(200).json("Success");
    }
  } catch (error) {
    res.status(500).json("Error: " + error);
    return;
  }
}
