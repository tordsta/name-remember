import { useUser } from "@/lib/reactQuery/clientHooks/useUser";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function UserEmblem() {
  const user = useUser();

  const router = useRouter();

  if (!user) {
    return <p className="mx-auto p-2">Loading...</p>;
  }

  return (
    <>
      <div className="hidden md:block w-40 h-32 mx-auto my-4" />
      <div
        onClick={() => router.push("/profile")}
        className="flex flex-row md:flex-col-reverse md:fixed md:bottom-0 gap-4 mx-4 my-auto md:my-4 cursor-pointer"
      >
        <div className="hidden sm:block">
          <p className="text-lg">{user?.name}</p>
          <p className="text-sm">{user?.email}</p>
        </div>

        <Image
          src={user?.image ?? "/icons/person110x110.png"}
          style={{ borderRadius: "50%", border: "1px solid #000" }}
          alt="Profile Picture"
          width={50}
          height={50}
        />
      </div>
    </>
  );
}
