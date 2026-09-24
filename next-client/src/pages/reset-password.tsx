import { FramedButton } from "@/components/Button";
import { notifyError, notifyPromiseFetch } from "@/components/Notify";
import Layout from "@/components/navigation/Layout";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ResetPassword() {
  // Read from the pages router: next/navigation's useSearchParams stays empty
  // on a hard page load, which is how users arrive here from an email link.
  const router = useRouter();
  const token =
    typeof router.query.token === "string" ? router.query.token : null;
  const email =
    typeof router.query.email === "string" ? router.query.email : null;
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const handlePasswordReset = async () => {
    if (!newPassword || !newPasswordConfirm) {
      notifyError("Please enter a new password");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      notifyError("Passwords do not match");
      return;
    }
    if (!email || !token) {
      notifyError("No email or no token provided");
      router.push("/");
      return;
    }

    const res = await notifyPromiseFetch({
      url: "/api/auth/reset-password",
      body: JSON.stringify({
        email: email,
        token: token,
        password: newPassword,
      }),
      pending: "Resetting password...",
      success: "Password reset successfully",
      error: "Error: Password not reset",
    });
    if (res?.status === 200) {
      router.push("/");
    }
  };

  return (
    <Layout nav={false} auth={false}>
      <div className="flex flex-col items-center justify-center text-center m-auto px-10 max-w-lg gap-4">
        <p>
          Enter your new password below. You will be redirected to the login
          page.
        </p>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-black px-2 py-1 w-52"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          className="border border-black px-2 py-1 w-52"
        />
        <FramedButton onClick={handlePasswordReset}>
          Reset password
        </FramedButton>
      </div>
    </Layout>
  );
}
