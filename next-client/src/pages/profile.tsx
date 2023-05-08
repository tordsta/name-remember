import LoginButton from "@/components/LoginButton";
import StyledLink from "@/components/style/Link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  console.log(
    "Session:",
    JSON.stringify(session),
    "Status:",
    JSON.stringify(status)
  );

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      {session?.user?.image && (
        <Image
          src={session?.user?.image}
          alt="Profile Picture"
          width={100}
          height={100}
        />
      )}
      <LoginButton />
      <div className="fixed bottom-0 sm:bottom-auto sm:top-0 w-full align-middle border sm:border-0 border-black dark:border-white">
        <StyledLink href="/">
          <div className="flex items-center justify-center gap-1 w-full py-2 pr-3 pl-0 sm:pt-8">
            <div className="invert-0 dark:invert">
              <Image
                src="/backChevron.svg"
                alt=""
                aria-label="Back Icon"
                height={20}
                width={20}
              />
            </div>
            Back
          </div>
        </StyledLink>
      </div>
    </div>
  );
}
