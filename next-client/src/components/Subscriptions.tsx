import { useEffect, useState } from "react";
import Stripe from "stripe";
import CreditCardModal from "./CreditCardModal";
import { Elements } from "@stripe/react-stripe-js";
import { stripeClientPromise } from "@/lib/stripe";
import { useRouter } from "next/router";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from "./Notify";
import { FramedButton } from "./Button";
import { useUser } from "@/lib/reactQuery/clientHooks/useUser";
import { useProducts } from "@/lib/reactQuery/clientHooks/useProducts";
import { useQueryClient } from "react-query";
import LoadingAnimation from "./navigation/LoadingAnimation";

export default function Subscriptions() {
  const [openSignal, setOpenSignal] = useState(true);
  const [currency, setCurrency] = useState<string>("usd");
  const [price, setPrice] = useState<number>(2);
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined
  );
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const router = useRouter();
  const user = useUser();
  const products: Stripe.Product[] = useProducts();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && user.subscription_plan == "premium") {
      setIsPremium(true);
    }
    if (user && user.subscription_plan == "free") {
      setIsPremium(false);
    }
    if (router.query.redirect_status) {
      switch (router.query.redirect_status) {
        case "succeeded":
          notifySuccess("Success! Payment received.");
          break;
        case "processing":
          notifyInfo(
            "Payment processing. We'll update you when payment is received."
          );
          break;
        case "requires_payment_method":
          notifyError("Payment failed. Please try another payment method.");
          break;

        default:
          notifyWarning("Something went wrong");
          break;
      }
      router.replace("/profile", undefined, { shallow: true });
    }
  }, [router, user]);

  const handleSubscription = async ({
    priceId,
  }: {
    priceId: string | Stripe.Price | null | undefined;
  }) => {
    if (!clientSecret) {
      const res = await fetch("/api/stripe/newSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceId,
          currency: currency,
          name: user?.name,
        }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    }
    setOpenSignal(true);
  };

  const handleCancelSubscription = async ({
    productId,
  }: {
    productId: string;
  }) => {
    const res = await fetch("/api/stripe/cancelSubscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: productId }),
    });
    if (res.ok) {
      notifySuccess("Subscription cancelled.");
      setIsPremium(false);
      // Wait for stripe webhook and server communication
      setTimeout(() => {
        queryClient.invalidateQueries("user");
        queryClient.refetchQueries("user");
      }, 5000);
    } else {
      notifyError("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center m-8">
      <div className="flex justify-center gap-8">
        {!products && (
          <div className="w-72 h-72 flex flex-col justify-center items-center bg-white rounded-lg border">
            <LoadingAnimation size="medium" />
          </div>
        )}
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="w-72 flex flex-col justify-center items-center text-center bg-white rounded-lg border py-4 px-6"
            >
              <h3 className="font-bold text-xl">{product.name}</h3>
              {(product.default_price as any).id && !isPremium && (
                <div className="flex text-lg">
                  {price}
                  <select
                    className="border border-black border-dashed rounded-lg mx-2 py-0 leading-none"
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      setPrice(
                        (product.default_price as any).currency_options[
                          e.target.value
                        ].unit_amount / 100
                      );
                    }}
                  >
                    {Object.keys(
                      (product.default_price as any).currency_options
                    ).map((currency) => (
                      <>
                        <option key={currency} value={currency}>
                          {currency.toUpperCase()}
                        </option>
                      </>
                    ))}
                  </select>
                  /
                  {(
                    product.default_price as any
                  ).recurring.interval.toUpperCase()}
                </div>
              )}
              {isPremium && <h3 className="font-bold m-1">Status: Active</h3>}
              <p className="mb-4">{product.description}</p>
              {!isPremium && (
                <FramedButton
                  onClick={() =>
                    handleSubscription({
                      priceId: (product.default_price as any).id,
                    })
                  }
                >
                  Upgrade
                </FramedButton>
              )}
              {isPremium && (
                <FramedButton
                  onClick={() =>
                    handleCancelSubscription({ productId: product.id })
                  }
                >
                  Cancel subscription
                </FramedButton>
              )}
            </div>
          ))}
      </div>
      {clientSecret && (
        <Elements
          stripe={stripeClientPromise}
          options={{ clientSecret: clientSecret }}
        >
          <CreditCardModal
            clientSecret={clientSecret}
            openSignal={openSignal}
            setOpenSignal={setOpenSignal}
            price={price}
            currency={currency}
          />
        </Elements>
      )}
    </div>
  );
}
