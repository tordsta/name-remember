import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { stripeServer } from "@/lib/stripe";
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
  const name = session.user?.name || null;
  const priceId = req.body.priceId;
  if (!email || !name || typeof priceId !== "string") {
    res.status(400).json("Bad Request");
    return;
  }

  try {
    const { rows } = await sql({
      query: `SELECT stripe_customer_id FROM users WHERE email = $1`,
      values: [email],
    });
    const stripe_customer_id = rows[0]?.stripe_customer_id;

    let customer;
    if (!stripe_customer_id) {
      customer = await stripeServer.customers.create({
        email: email,
        name: name,
      });
      await sql({
        query: `UPDATE users SET stripe_customer_id = $1 WHERE email = $2`,
        values: [customer.id, email],
      });
    } else {
      customer = await stripeServer.customers.retrieve(stripe_customer_id);
    }

    const subscription = await stripeServer.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const client_secret =
      //@ts-ignore
      subscription.latest_invoice?.payment_intent.client_secret;
    res.status(200).json({
      subscriptionId: subscription.id,
      clientSecret: client_secret,
    } as unknown as string);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
