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
    res.status(200).json("Unauthorized cookie consent update");
    return;
  }

  const email = session.user?.email || null;
  const consent: string | null = req.body.consent || null;
  if (!email || !consent) {
    res.status(400).json("Bad Request");
    return;
  }

  try {
    await sql({
      query: `
            UPDATE users
            SET cookie_consent = $1, cookie_consent_date = NOW()
            WHERE email = $2;
        `,
      values: [consent, email],
    });
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
    return;
  }
}
