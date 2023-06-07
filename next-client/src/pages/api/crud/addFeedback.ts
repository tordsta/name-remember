import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Unauthorized");
    return;
  }

  const email = session.user?.email || null;
  const type: string | null = req.body.type || null;
  const message: string | null = req.body.message || null;
  const file: string | null = req.body.file || null;

  if (!type || !message || !email) {
    console.log("Missing type or message or email", JSON.stringify(req.body));
    res.status(400).json("Missing variables");
    return;
  }

  try {
    await sql`
        INSERT INTO user_feedback (email, type, message, file)
        VALUES (${email}, ${type}, ${message}, ${file})`;
    //TODO send email to admin
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
