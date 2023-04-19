import { Inter } from "next/font/google";
import LoginButton from "@/components/loginButton";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {status === "unauthenticated" && <h1>Frontpage</h1>}
        {status === "authenticated" && <h1>Dashboard</h1>}
        <LoginButton />
      </div>
    </main>
  );
}
