import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Button, { FramedButton } from "@/components/style/Button";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session && router.pathname === "/") {
    return (
      <>
        <p className="text-xl mx-auto text-center mb-3">Already logged in</p>
        <FramedButton onClick={() => router.push("/dashboard")}>
          <p className="text-xl">To Dashboard</p>
        </FramedButton>
      </>
    );
  }
  if (session) {
    return (
      <FramedButton
        onClick={() => {
          signOut();
          router.push("/");
        }}
      >
        <p className="text-2xl">Sign out</p>
      </FramedButton>
    );
  }
  return (
    <FramedButton onClick={() => signIn()}>
      <p className="text-2xl">Sign in</p>
    </FramedButton>
  );
}
