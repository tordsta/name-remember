import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FramedButton } from "@/components/Button";
import { trackAmplitudeData } from "@/utils/amplitude";

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
          trackAmplitudeData("Sign Out");
          signOut();
          router.push("/");
        }}
      >
        <p className="text-2xl">Sign out</p>
      </FramedButton>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-xl md:text-3xl mx-auto mb-4 text-center">
        Get started with Name Remember today,
        <br /> it&apos;s free.
      </p>

      <FramedButton
        style="relative w-60 h-10"
        onClick={() => {
          trackAmplitudeData("Create new account");
          signIn();
        }}
      >
        <p className="text-2xl">Create new account</p>
      </FramedButton>
      <p className="text-xl mx-auto my-2 text-center">or</p>
      <FramedButton
        onClick={() => {
          trackAmplitudeData("Log In");
          signIn();
        }}
      >
        <p className="text-2xl">Log in</p>
      </FramedButton>
    </div>
  );
}
