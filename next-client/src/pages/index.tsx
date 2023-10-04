import Layout from "@/components/navigation/Layout";
import Image from "next/image";
import LoginButton from "@/components/navigation/LoginButton";
import LegalInfo from "@/components/LegalInfo";
import { useEffect } from "react";
import { trackAmplitudeData } from "@/lib/amplitude";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    trackAmplitudeData("Loaded Page Landing Page");
  }, []);

  return (
    <Layout nav={false} auth={false}>
      <div className="flex flex-row min-h-[100vh]">
        {/* Whole page on mobile, left side on desktop. */}
        <div className="flex flex-col justify-evenly md:justify-center items-center py-8 md:py-0 border-0 md:border border-black w-full md:w-[50vw] h-full">
          {/* Hidden on desktop */}
          <h1 className="block md:hidden text-3xl">Name Remember</h1>
          <div className="relative w-full h-full mt-4 mx-4 max-w-[250px] md:max-w-[384px] min-h-[250px] max-h-[250px] md:max-h-[384px]">
            <Image
              src="/frontImage1.jpg"
              alt="Name Remember"
              fill
              priority
              sizes="100%"
              style={{
                objectFit: "cover",
                boxShadow: "0px 0px 20px 10px white",
              }}
            />
          </div>
          <h2 className="text-xl md:text-3xl text-center mt-4 md:mt-8">
            How it works:
          </h2>
          <ol className="text-lg md:text-2xl text-left list-decimal list-inside">
            <li>Create groups</li>
            <li>Upload photos</li>
            <li>Set memorization interval</li>
            <li>Get reminders and memorize</li>
            <li>Never forget a name again</li>
          </ol>
          {/* Hidden on desktop */}
          <div className="flex flex-col justify-center items-center md:hidden mt-8">
            <LoginButton />
            <LegalInfo />
          </div>
        </div>
        {/* Right side on desktop, hidden on mobile */}
        <div className="hidden md:flex flex-col bg-white w-[50vw] h-full">
          <h1 className="text-4xl ml-auto p-16">Name Remember</h1>
          <div className="flex flex-col items-center justify-center h-full pb-40">
            <p className="text-2xl md:text-3xl mx-auto mb-4 text-center">
              Get started today,
              <br /> it&apos;s free.
            </p>
            <LoginButton loginText="Create new account" />
            <p className="text-xl mx-auto my-2 text-center">or</p>
            <LoginButton />
            <LegalInfo />
          </div>
        </div>
      </div>
    </Layout>
  );
}
