import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "@/components/style/Button";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    console.log(session);
    return (
      <>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <Button style="green" onClick={() => signIn()}>
        Sign in
      </Button>
    </>
  );
}
