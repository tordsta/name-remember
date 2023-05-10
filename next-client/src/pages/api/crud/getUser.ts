import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // const session = await getServerSession(req, res, authOptions);
  // if (session) {
  //   const { email } = session.user?.email ? session.user : { email: null };
  //   if (!email) {
  //     res.status(401).json(JSON.stringify("No email found"));
  //     res.end();
  //   }
  //   const { rows, fields } = await sql`SELECT * FROM users`; // WHERE email = ${email}`;
  //   res.status(200).json(JSON.stringify({ rows, fields }));
  // } else {
  //   res.status(401);
  // }
  // res.end();
}
