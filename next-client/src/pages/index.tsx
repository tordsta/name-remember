import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import FrontPage from "@/components/FrontPage";
import Dashboard from "@/components/Dashboard";

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
      {status === "unauthenticated" && <FrontPage />}
      {status === "authenticated" && <Dashboard />}
    </main>
  );
}
