import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    console.log(session);
    return (
      <>
        <button
          className="border-2 border-white rounded-md px-4 py-2 font-bold"
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      <button
        className="border-2 border-white rounded-md px-4 py-2 font-bold"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
