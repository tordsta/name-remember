import Stripe from "stripe";
import { mocked } from "./integrations";
import mockStripe from "./mocks/mockStripe";

// Server only. The browser-side client lives in ./stripeClient.
export const stripeServer = mocked.stripe
  ? mockStripe
  : new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-08-16",
      typescript: true,
    });
