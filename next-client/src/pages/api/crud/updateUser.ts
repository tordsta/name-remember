import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import sql from "@/lib/pgConnect";
import { Session } from "@/utils/types";

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
  const image: string | null = req.body.image || null;
  if (!email) {
    res.status(401).json("Unauthorized");
    return;
  }

  try {
    if (image) {
      await sql({
        query: `
            UPDATE users
            SET image = $1
            WHERE email = $3
        `,
        values: [image, email],
      });
    }
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
