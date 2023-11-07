import { useUser } from "@/lib/reactQuery/clientHooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import LoadingAnimation from "./LoadingAnimation";

export default function UserEmblem() {
  const user = useUser();

  const router = useRouter();

  return (
    <>
      <div
        onClick={() => router.push("/profile")}
        className="flex flex-col md:fixed md:bottom-0 w-auto justify-between mx-4 my-auto md:m-0 md:p-4 cursor-pointer overflow-clip"
      >
        {!user && <LoadingAnimation size="small" />}
        {user && (
          <>
            <div className="flex">
              <p className="hidden md:block text-lg overflow-ellipsis break-words w-28 min-h-[3.2em] pr-2">
                {user?.name}
              </p>
              <div className="w-[50px] h-[50px]">
                <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border border-black">
                  <Image
                    src={user?.image ?? "/icons/person110x110.png"}
                    alt="Uploaded image"
                    fill
                    sizes="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            <p className="hidden md:block text-sm break-words w-40">
              {user?.email}
            </p>
          </>
        )}
      </div>
    </>
  );
}
