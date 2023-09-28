import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import DefaultModal from "./Modal";
import { FramedButton } from "./Button";

export default function CardModal({
  clientSecret,
  openSignal,
  setOpenSignal,
}: {
  clientSecret: string;
  openSignal: boolean;
  setOpenSignal: (arg: boolean) => void;
}) {
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
      setOpenSignal(false);
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  //make modal
  return (
    <DefaultModal openSignal={openSignal} setOpenSignal={setOpenSignal}>
      <form
        onSubmit={handleCardInfo}
        className="flex flex-col justify-center gap-8"
      >
        <PaymentElement />
        <div className="flex gap-3">
          <FramedButton typeSubmit={true} disabled={!stripe}>
            Submit
          </FramedButton>
          <FramedButton onClick={() => setOpenSignal(false)}>
            Cancel
          </FramedButton>
        </div>
      </form>
    </DefaultModal>
  );
}
