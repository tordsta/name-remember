import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/database/pgConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Unauthorized");
    return;
  }

  const { email } = session.user?.email ? session.user : { email: null };
  if (!email) {
    res.status(401).json(JSON.stringify("No email found"));
    res.end();
  }
  const { rows } = await sql({
    query: `SELECT * FROM users WHERE email = $1`,
    values: [email],
  });
  res.status(200).json(rows[0]);
}
