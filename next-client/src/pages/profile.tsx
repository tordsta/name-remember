import LoginButton from "@/components/auth/LoginButton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "@/components/navigation/Layout";
import FeedbackForm from "@/components/FeedbackForm";
import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";
import Subscriptions from "@/components/Subscriptions";
import UpdatePassword from "@/components/auth/UpdatePassword";
import DeleteProfileModal from "@/components/peopleLists/DeleteProfileModal";

export default function Profile() {
  const { data: session } = useSession();

  useEffect(() => {
    trackAmplitudeData("Loaded Page Profile");
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full gap-4 md:gap-20 md:mt-32">
        <div className="flex flex-col items-center md:flex-row-reverse gap-4 md:justify-evenly w-full">
          <Subscriptions />
          <div className="display md:hidden mx-auto">
            <FeedbackForm />
          </div>
          <div className="flex flex-col gap-4 justify-center items-center m-8">
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
            <UpdatePassword />
            <LoginButton />
          </div>
        </div>
        <div className="m-8 mb-16 md:mb-8">
          <DeleteProfileModal />
        </div>
      </div>
    </Layout>
  );
}
