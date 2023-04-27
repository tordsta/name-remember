import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import StyledButton from "./style/button";

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
      <StyledButton onClick={() => signIn()}>Sign in</StyledButton>
    </>
  );
}
