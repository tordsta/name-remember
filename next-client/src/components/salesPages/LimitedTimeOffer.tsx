import { useRouter } from "next/router";
import Button from "../Button";

export default function LimitedTimeOffer() {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-2xl">🎁 Limited Time Offer!</h2>
      <Button style="green" onClick={() => router.push("/email-sign-up")}>
        Claim your free trial
      </Button>
      <p className="text-lg pl-4 pt-1">
        Sign up today and get 30 days FREE premium access to all features of
        NameRemember. That’s a whole month to witness the transformation in your
        classroom interactions.
      </p>
    </div>
  );
}
