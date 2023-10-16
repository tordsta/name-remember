import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/lib/pgConnect";
import { Session } from "@/utils/types";
import sendNewFeedbackMail from "@/lib/postmarkEmail/sendNewFeedbackMail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session: Session | null | undefined = await getServerSession(
    req,
    res,
    authOptions as any
  );
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
    await sql({
      query: `
        INSERT INTO user_feedback (email, type, message, file)
        VALUES ($1, $2, $3, $4)`,
      values: [email, type, message, file],
    });
    const file_upload = file ? true : false;
    const recipientEmail = process.env.ADMIN_EMAIL as string;
    sendNewFeedbackMail({
      recipientEmail,
      type,
      message,
      file_upload,
    });

    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
