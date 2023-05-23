import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function UserEmblem() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <Link
      href="/profile"
      className="flex flex-row md:flex-col-reverse md:fixed md:bottom-0 gap-4 mx-4 my-auto md:my-4"
    >
      <div className="hidden sm:block">
        <p className="text-lg">{session?.user?.name}</p>
        <p className="text-sm">{session?.user?.email}</p>
      </div>
      {session?.user?.image && (
        <Image
          src={session?.user?.image}
          style={{ borderRadius: "50%" }}
          alt="Profile Picture"
          width={50}
          height={50}
        />
      )}
    </Link>
  );
}
