import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FramedButton } from "@/components/Button";
import { trackAmplitudeData } from "@/lib/amplitude";

export default function LoginButton({ loginText }: { loginText?: string }) {
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
          trackAmplitudeData("Sign Out");
          signOut();
          router.push("/");
        }}
      >
        <p className="text-2xl">Sign out</p>
      </FramedButton>
    );
  }

  if (loginText) {
    return (
      <FramedButton
        width={240}
        onClick={() => {
          trackAmplitudeData("Create new account");
          signIn();
        }}
      >
        <p className="text-2xl">{loginText}</p>
      </FramedButton>
    );
  }
  return (
    <FramedButton
      onClick={() => {
        trackAmplitudeData("Log In");
        signIn();
      }}
    >
      <p className="text-2xl">Log in</p>
    </FramedButton>
  );
}
