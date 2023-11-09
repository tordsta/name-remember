import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { stripeServer } from "@/lib/stripe";
import { Session } from "@/utils/types";
import sql from "@/lib/pgConnect";

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

  const { starting_after, ending_before, limit } = req.body;
  if (
    typeof starting_after !== ("string" || "undefined") &&
    typeof ending_before !== ("string" || "undefined") &&
    typeof limit !== "number"
  ) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    const { rows } = await sql({
      query: `
            SELECT stripe_customer_id FROM users WHERE email = $1
        `,
      values: [session.user.email],
    });
    if (typeof rows[0].stripe_customer_id !== "string") {
      res.status(500).json("Error");
      return;
    }
    console.log("stripe_customer_id", rows[0].stripe_customer_id);

    const transactions = await stripeServer.invoices.list({
      customer: rows[0].stripe_customer_id,
      limit: limit,
      starting_after: starting_after,
      ending_before: ending_before,
    });
    console.log(transactions);

    if (!transactions) res.status(404).json("Transactions not found");
    res.status(200).json(transactions as unknown as string);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
    return;
  }
}
