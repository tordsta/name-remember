import { FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CardModal({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();

  if (!clientSecret) return <></>;

  const handleCardInfo = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL!,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  //make modal
  return (
    <div className="">
      <form onSubmit={handleCardInfo}>
        <PaymentElement />
        <button disabled={!stripe}>Submit</button>
      </form>
    </div>
  );
}
