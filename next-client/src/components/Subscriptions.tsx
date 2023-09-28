import { useEffect, useState } from "react";
import Stripe from "stripe";
import CardModal from "./CardModal";
import { Elements } from "@stripe/react-stripe-js";
import { stripeClientPromise } from "@/lib/stripe";
import { useRouter } from "next/router";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from "./Notify";
import { User } from "@/utils/types";
import { FramedButton } from "./Button";

export default function Subscriptions() {
  const [openSignal, setOpenSignal] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Stripe.Product[]>([]);
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    fetch("/api/stripe/getProducts")
      .then((res) => res.json())
      .then((res) => setProducts(res));
    fetch("/api/crud/getUser")
      .then((res) => res.json())
      .then((res) => setUser(res));
    handlePaymentRedirect({
      redirectStatus: router.query.redirect_status as string,
    });
  }, [router.query.redirect_status]);

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
      setUser(null);
    } else {
      notifyError("Something went wrong.");
    }
  };

  const handlePaymentRedirect = ({
    redirectStatus,
  }: {
    redirectStatus: string;
  }) => {
    if (redirectStatus) {
      switch (redirectStatus) {
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
  };

  return (
    <div className="flex flex-col items-center m-8">
      <div className="flex justify-center gap-8">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="w-72 flex flex-col justify-center items-center text-center bg-white rounded-lg border py-4 px-6"
            >
              <h3 className="font-bold text-xl">{product.name}</h3>
              {user && user.subscription_plan == "premium" && (
                <h3 className="font-bold m-1">Status: Active</h3>
              )}
              <p className="mb-4">{product.description}</p>
              {(!user || user.subscription_plan == "free") && (
                <FramedButton
                  onClick={() =>
                    handleSubscription({ priceId: product.default_price })
                  }
                >
                  Upgrade
                </FramedButton>
              )}
              {user && user.subscription_plan == "premium" && (
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
          <CardModal
            clientSecret={clientSecret}
            openSignal={openSignal}
            setOpenSignal={setOpenSignal}
          />
        </Elements>
      )}
    </div>
  );
}
