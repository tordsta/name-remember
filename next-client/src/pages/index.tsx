import Layout from "@/components/Layout";
import Image from "next/image";
import LoginButton from "@/components/LoginButton";
import LegalInfo from "@/components/LegalInfo";

export default function Home() {
  return (
    <Layout nav={false} auth={false}>
      <div className="flex flex-row h-[100vh]">
        <div className="flex flex-col justify-evenly md:justify-center items-center py-4 md:py-0 border-0 md:border border-black w-full md:w-[50vw] h-full">
          <h1 className="block md:hidden text-3xl">Name Remember</h1>
          <div className="mt-4 mx-4">
            <Image
              src="/frontImage1.png"
              alt="Name Remember"
              width={384}
              height={384}
              priority
              style={{ boxShadow: "0px 0px 20px 10px white" }}
            />
          </div>
          <h2 className="text-xl md:text-3xl text-center mt-8">
            Get started with Name Remember.
          </h2>
          <div className="flex flex-col justify-center items-center md:hidden">
            <LoginButton />
            <LegalInfo />
          </div>
          <div className="mt-0 md:mt-8 md:mb-8 text-lg text-center">
            <h2>Learn names and faces quickly,</h2>
            <h3>Stay connected with your contacts.</h3>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center bg-white w-[50vw] h-full">
          <h1 className="text-4xl ml-auto p-16">Name Remember</h1>
          <div className="flex flex-col flex-grow justify-center items-center">
            <LoginButton />
            <LegalInfo />
          </div>
          <div className="p-20" />
        </div>
      </div>
    </Layout>
  );
}
