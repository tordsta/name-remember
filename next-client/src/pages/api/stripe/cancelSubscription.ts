import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { stripeServer } from "@/lib/stripe";
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

  const email = session.user?.email || null;
  const name = session.user?.name || null;
  const productId = req.body.productId;

  if (!email || !name || !productId) {
    res.status(400).json("Bad Request");
    return;
  }

  try {
    const { rows } = await sql({
      query: "SELECT * FROM users WHERE email = $1",
      values: [email],
    });
    const { stripe_customer_id } = rows[0];

    const { rows: rows2 } = await sql({
      query:
        "SELECT * FROM stripe_subscriptions WHERE customer_id = $1 AND product_id = $2",
      values: [stripe_customer_id, productId],
    });
    if (rows2.length > 1) {
      res.status(500).json("Error: more than one subscription found");
      return;
    }
    const { subscription_id } = rows2[0];

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
