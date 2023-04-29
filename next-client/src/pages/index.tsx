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
        <div className="flex flex-col flex-grow justify-center md:justify-between items-center my-8 md:my-20 mx-2">
          <h1 className="text-4xl md:text-7xl font-bold">Name Remember</h1>
          <h2 className="text-xl md:text-2xl text-center mt-2">
            Never forget names again! <br /> Memorize names with Name Remember.
          </h2>
          {/* carousel with screenshots of app */}
          <div className="h-64 bg-rose-600 mt-4">
            carousel with screenshots of app
          </div>
          <div className="mt-4 flex flex-col items-center">
            <h3 className="font-bold text-2xl mb-2">Sign in now!</h3>
            <LoginButton />
          </div>
          <div className="mt-4 md:mb-8 text-center">
            <h3 className="font-bold">How it works:</h3>
            <p>1. Upload photos of the people to remember.</p>
            <p>2. Set an memorizing interval.</p>
            <p>3. Practice, practice, practice.</p>
          </div>
        </div>
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
