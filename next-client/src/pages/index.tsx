import { Inter } from "next/font/google";
import LoginButton from "@/components/loginButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1>Frontpage</h1>
        <p>Login</p>
        <LoginButton />
      </div>
    </main>
  );
}
