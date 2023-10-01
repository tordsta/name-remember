import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export const stripeServer = new Stripe(`${process.env.STRIPE_SECRET_KEY!}`, {
  apiVersion: "2023-08-16",
  typescript: true,
});

export const stripeClientPromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}`
);
