import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  //res.status(500).json("Error writing document: ");
  // const session = await getServerSession(req, res, authOptions);
  // if (session) {
  //   const { email } = session.user?.email ? session.user : { email: null };
  //   const name = req.query.name;
  //   if (!name || !email) {
  //     res.status(400).json("Missing name or email");
  //     res.end();
  //     return;
  //   }
  //   res.end();
  // }
}
