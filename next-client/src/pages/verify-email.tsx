import { FramedButton } from "@/components/Button";
import { notifyError, notifyPromiseFetch } from "@/components/Notify";
import Layout from "@/components/navigation/Layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!email) return;
    if (!token && !emailSent) {
      fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      setEmailSent(true);
      return;
    }
    if (!token) return;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        token: token,
      }),
    }).then((res) => {
      if (res.ok) {
        router.push("/");
      } else {
        notifyError("Email verification failed");
      }
    });
  }, [token, email, router, emailSent]);

  const handleResendEmail = async () => {
    if (!email) {
      notifyError("No email address provided");
      router.push("/");
      return;
    }

    await notifyPromiseFetch({
      url: "/api/auth/verify-email",
      body: JSON.stringify({
        email: email,
      }),
      pending: "Sending email...",
      success: "Email sent",
      error: "Email sending failed",
    });
  };

  return (
    <Layout nav={false} auth={false}>
      <div className="flex flex-col items-center justify-center text-center m-auto px-10 max-w-lg">
        <p>
          An email has been sent to your email address: {email && email}. Please
          click the link in the email to verify your account.
        </p>
        <p className="mt-5 mb-3">Not received an email?</p>
        <FramedButton onClick={handleResendEmail}>Resend email</FramedButton>
      </div>
    </Layout>
  );
}
