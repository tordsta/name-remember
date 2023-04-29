import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import StyledButton, { GreenButton } from "./style/buttons";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    console.log(session);
    return (
      <>
        <StyledButton
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </StyledButton>
      </>
    );
  }
  return (
    <>
      <GreenButton onClick={() => signIn()}>Sign in</GreenButton>
    </>
  );
}
