import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
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
  res.status(200).json({
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
    image: rows[0].image,
    subscription_plan: rows[0].subscription_plan,
    stripe_customer_id: rows[0].stripe_customer_id,
  });
}
