import { NextApiRequest, NextApiResponse } from "next";
import { stripeServer } from "@/lib/stripe";
import getRawBody from "raw-body";
import Stripe from "stripe";
import sql from "@/lib/pgConnect";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateSubscriptionPlan({
  status,
  customerId,
}: {
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid"
    | "paused";
  customerId: string;
}) {
  if (status === "active" || status === "trialing" || status === "past_due") {
    await sql({
      query: `UPDATE users SET subscription_plan = $1 WHERE stripe_customer_id = $2`,
      values: ["premium", customerId],
    });
  }
  if (
    status === "canceled" ||
    status === "incomplete" ||
    status === "incomplete_expired" ||
    status === "unpaid" ||
    status === "paused"
  ) {
    await sql({
      query: `UPDATE users SET subscription_plan = $1 WHERE stripe_customer_id = $2`,
      values: ["free", customerId],
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("No signature");

  let event;

  try {
    event = stripeServer.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  switch (event.type) {
    case "customer.subscription.created":
      const subscriptionCreated = event.data.object as Stripe.Subscription;
      const productIdC = subscriptionCreated.items.data[0].price.product;
      const subscriptionIdC = subscriptionCreated.id;
      const customerIdC = subscriptionCreated.customer;
      const statusC = subscriptionCreated.status;

      await updateSubscriptionPlan({
        status: statusC,
        customerId: customerIdC as string,
      });
      await sql({
        query:
          "INSERT INTO stripe_subscriptions (subscription_id, customer_id, product_id, status) VALUES ($1, $2, $3, $4)",
        values: [subscriptionIdC, customerIdC, productIdC, statusC],
      });
      break;

    case "customer.subscription.updated":
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      const productIdU = subscriptionUpdated.items.data[0].price.product;
      const subscriptionIdU = subscriptionUpdated.id;
      const customerIdU = subscriptionUpdated.customer;
      const statusU = subscriptionUpdated.status;

      await updateSubscriptionPlan({
        status: statusU,
        customerId: customerIdU as string,
      });
      await sql({
        query:
          "UPDATE stripe_subscriptions SET status = $1 WHERE subscription_id = $2 AND customer_id = $3 AND product_id = $4",
        values: [statusU, subscriptionIdU, customerIdU, productIdU],
      });

      break;

    case "customer.subscription.deleted":
      const subscriptionDelete = event.data.object as Stripe.Subscription;
      const subscriptionIdD = subscriptionDelete.id;
      const statusD = subscriptionDelete.status;

      await updateSubscriptionPlan({
        status: statusD,
        customerId: subscriptionDelete.customer as string,
      });

      await sql({
        query: "DELETE FROM stripe_subscriptions WHERE subscription_id = $1",
        values: [subscriptionIdD],
      });

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("OK");
}
