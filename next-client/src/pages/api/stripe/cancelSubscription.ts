import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { stripeServer } from "@/lib/stripe";
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

  const email = session.user?.email || null;
  const productId = req.body.productId;

  if (!email || !productId) {
    res.status(400).json("Bad Request");
    return;
  }

  try {
    const { rows } = await sql({
      query: "SELECT * FROM users WHERE email = $1",
      values: [email],
    });
    const { stripe_customer_id } = rows[0];
    console.log("stripe_customer_id", stripe_customer_id);

    const { rows: rows2 } = await sql({
      query:
        "SELECT * FROM stripe_subscriptions WHERE customer_id = $1 AND product_id = $2 AND status = 'active'",
      values: [stripe_customer_id, productId],
    });
    if (rows2.length > 1) {
      res.status(500).json("Error: more than one subscription found");
      return;
    }
    const { subscription_id } = rows2[0];
    console.log("subscription_id", subscription_id);
    if (!subscription_id) {
      console.log("Error: no subscription found");
      res.status(500).json("Error: no subscription found");
      return;
    }

    const deletedSubscription = await stripeServer.subscriptions.cancel(
      subscription_id
    );
    if (!deletedSubscription) {
      res.status(500).json("Error: subscription not deleted");
      return;
    }
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
