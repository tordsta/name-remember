import LoginButton from "@/components/LoginButton";
import CustomLink from "@/components/style/Link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import AccessDeniedScreen from "@/components/AccessDeniedScreen";
import Layout from "@/components/Layout";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/");
    return <AccessDeniedScreen />;
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen mx-auto">
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
      </div>
    </Layout>
  );
}
