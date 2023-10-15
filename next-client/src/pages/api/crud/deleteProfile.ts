import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/lib/pgConnect";
import { Session } from "@/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Session | null | undefined = await getServerSession(
    req,
    res,
    authOptions as any
  );
  if (!session) return res.status(401).json("Unauthorized");
  const email = session.user?.email || null;
  if (!email) return res.status(401).json("Unauthorized");

  try {
    const { rows } = await sql({
      query: `
          DELETE FROM users WHERE email = $1;
        `,
      values: [email],
    });

    res.status(200).json("User deleted");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error deleting user: " + error);
    return;
  }
}
