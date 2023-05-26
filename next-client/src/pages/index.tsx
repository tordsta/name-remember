import Layout from "@/components/Layout";
import Image from "next/image";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-row h-[100vh]">
        <div className="flex flex-col justify-evenly md:justify-center items-center py-4 md:py-0 border-0 md:border border-black w-full md:w-[50vw] h-full">
          <h1 className="block md:hidden text-3xl">Name Remember</h1>
          <div className="mt-4 mx-4">
            <Image
              src="/frontImage1.png"
              alt="Name Remember"
              width={384}
              height={384}
              style={{ boxShadow: "0px 0px 20px 10px white" }}
            />
          </div>
          <h2 className="text-xl md:text-3xl text-center mt-8">
            Get started with Name Remember.
          </h2>
          <div className="block md:hidden">
            <LoginButton />
          </div>
          <div className="mt-0 md:mt-8 md:mb-8 text-lg text-center">
            <p>Learn names and faces quickly,</p>
            <p>Stay connected with your contacts.</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center bg-white w-[50vw] h-full">
          <h1 className="text-4xl ml-auto p-16">Name Remember</h1>
          <div className="flex flex-col flex-grow justify-center items-center">
            <LoginButton />
          </div>
          <div className="p-20" />
        </div>
      </div>
    </Layout>
  );
}
