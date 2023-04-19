import { useSession } from "next-auth/react";
import Image from "next/image";

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
    <div>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.name}</p>
      {session?.user?.image && (
        <Image
          src={session?.user?.image}
          alt="Profile Picture"
          width={100}
          height={100}
        />
      )}
    </div>
  );
}
