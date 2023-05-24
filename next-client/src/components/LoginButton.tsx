import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Button, { FramedButton } from "@/components/style/Button";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <FramedButton
        onClick={() => {
          signOut();
        }}
      >
        <p className="text-2xl">Sign out</p>
      </FramedButton>
    );
  }
  return (
    <FramedButton style="green" onClick={() => signIn()}>
      <p className="text-2xl">Sign in</p>
    </FramedButton>
  );
}
