import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// null when there is no publishable key (Stripe mocked): no card form is shown.
export const stripeClientPromise = publishableKey
  ? loadStripe(publishableKey)
  : null;
