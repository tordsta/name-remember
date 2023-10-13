import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/database/pgConnect";
import { v4 as uuidv4 } from "uuid";
import sendVerificationMail from "@/lib/postmarkEmail/sendVerificationMail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const email = req.body.email || null;
  const token = req.body.token || null;

  if (!email) {
    res.status(400).json("Missing email or token");
    return;
  }

  try {
    if (email && !token) {
      //prevent email spamming, check how many times the email has been sent in the last hour
      //if more than 5 times, return error
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

      await sendVerificationMail({
        recipientEmail: email,
        recipientName: email,
        tokenUrl: `${process.env.NEXTAUTH_URL}/verify-email?email=${email}&token=${newToken}`,
      });

      res.status(200).json("Success");
    }

    if (email && token) {
      const { rows } = await sql({
        query: `
        UPDATE verification_tokens
        SET consumed_at = NOW()
        WHERE email = $1 AND token = $2 AND expires_at > NOW()
        RETURNING *;
        `,
        values: [email, token],
      });
      if (rows.length === 0) {
        res.status(500).json("Error: token not found or token expired");
        return;
      }

      await sql({
        query: `
        UPDATE users
        SET email_verified = true
        WHERE email = $1;
        `,
        values: [email],
      });

      res.status(200).json("Success");
    }
  } catch (error) {
    res.status(500).json("Error: " + error);
    return;
  }
}
