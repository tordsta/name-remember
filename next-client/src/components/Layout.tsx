// components/Layout.js

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import UserEmblem from "./UserEmblem";
import Image from "next/image";

export default function Layout({
  children,
  title = "Name Remember",
  auth = true,
  nav = true,
}: {
  children: React.ReactNode;
  title?: string;
  auth?: boolean;
  nav?: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated" && router.pathname !== "/" && auth) {
    router.push("/");
  }

  //TODO make page manifest
  //TODO add navigation: desktop & mobile (sidebar/topbar), back button.
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Name Remember" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col md:flex-row items-stretch justify-start min-h-screen min-w-full ">
        {nav && (
          <div className="flex flex-row md:flex-col justify-stretch w-full md:max-w-min mx-auto md:mx-0 border-b md:border-b-0 md:border-r border-black">
            <div className="md:mx-4 my-6 ml-6 mr-auto flex flex-row">
              {router.pathname !== "/dashboard" && (
                <div
                  className="md:hidden invert-0 my-auto mr-2"
                  onClick={() => router.push("/dashboard")}
                >
                  <Image
                    src="/backChevron.svg"
                    alt=""
                    aria-label="Back Icon"
                    height={20}
                    width={20}
                  />
                </div>
              )}
              <div
                className="text-3xl sm:text-4xl"
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Name Remember
              </div>
            </div>
            {router.pathname !== "/dashboard" && (
              <div
                className="hidden md:flex items-center justify-center gap-1 cursor-pointer"
                onClick={router.back}
              >
                <div className="invert-0">
                  <Image
                    src="/backChevron.svg"
                    alt=""
                    aria-label="Back Icon"
                    height={20}
                    width={20}
                  />
                </div>
                Back
              </div>
            )}
            <UserEmblem />
          </div>
        )}
        {children}
      </main>
    </>
  );
}
