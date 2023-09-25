import LoginButton from "@/components/LoginButton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "@/components/Layout";
import FeedbackForm from "@/components/FeedbackForm";
import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();

  useEffect(() => {
    trackAmplitudeData("Loaded Page Profile");
  }, []);

  return (
    <Layout>
      <div className="flex flex-col justify-between md:justify-center items-center min-h-screen w-full">
        <div className="flex flex-col gap-4 justify-center items-center m-auto">
          <p>{session?.user?.name}</p>
          <p>{session?.user?.email}</p>
          {/** TODO add send verification email again button here if email not verified */}
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
        <div className="m-auto">
          {/** TODO fix bug on mobile min-h-width overflows screen */}
          <FeedbackForm />
        </div>
      </div>
    </Layout>
  );
}
