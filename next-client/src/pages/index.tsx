import { Inter } from "next/font/google";
import LoginButton from "@/components/loginButton";
import { useSession } from "next-auth/react";
import UserEmblem from "@/components/userEmblem";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      {status === "unauthenticated" && (
        <>
          <h1>Front page</h1>
          <LoginButton />
        </>
      )}
      {status === "authenticated" && (
        <>
          <div className="flex w-full justify-between border-b border-white">
            <h1 className="text-2xl sm:text-4xl font-bold mx-8 my-6">
              Name Remember
            </h1>
            <UserEmblem />
          </div>
          <h1>Dashboard</h1>
        </>
      )}
    </main>
  );
}
