import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import UserEmblem from "./UserEmblem";
import Head from "next/head";
import CanvasBackground from "../CanvasBackground";
import { memo, useEffect, useRef, useState } from "react";
import FeedbackForm from "@/components/FeedbackForm";
import BackButton from "./BackButton";
import { Session } from "@/utils/types";
import { useConsent } from "react-hook-consent";
import { initAmplitude, stopAmplitude } from "@/lib/amplitude";

export default function Layout({
  children,
  title = "Name Remember - Boost Your Memory: Learn to Remember Names with Images",
  auth = true,
  nav = true,
}: {
  children: React.ReactNode;
  title?: string;
  auth?: boolean;
  nav?: boolean;
}) {
  const { status } = useSession();
  const session = useSession().data as Session;

  const router = useRouter();

  const { consent } = useConsent();

  if (status === "unauthenticated" && auth) {
    router.push("/");
  }

  const ref = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const MemoCanvasBackground = memo(CanvasBackground);

  const set = () => {
    if (!ref || !ref.current) return;
    setHeight(ref.current.getBoundingClientRect().height);
    setWidth(ref.current.getBoundingClientRect().width);
  };

  useEffect(() => {
    set();
    window.addEventListener("resize", set);
    window.addEventListener("scroll", set);
    return () => {
      window.removeEventListener("resize", set);
      window.removeEventListener("scroll", set);
    };
  }, []);

  useEffect(() => {
    if (consent.includes("analytics")) {
      initAmplitude();
    } else {
      stopAmplitude();
    }
    fetch("/api/crud/updateConsent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consent: consent,
      }),
    });
  }, [consent]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Forget no more names with Name Remember. 
          Learn names easily with our app using a personalized image database. 
          Ideal for networking, classrooms, and more.`}
        />
        <meta
          property="og:title"
          content="Name Remember - Master Name Recalling With Your Own Images"
        />
        <meta
          property="og:description"
          content="With Name Remember, learning names becomes easy. Create your personal image database and excel at name recall for networking, classrooms, and beyond."
        />
        <meta property="og:url" content="https://nameremember.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.nameremember.com/_next/image?url=%2FfrontImage1.png&w=828&q=75"
        />
        <meta property="og:site_name" content="Name Remember" />

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <main
        ref={ref}
        className="flex flex-col md:flex-row items-stretch justify-start min-h-screen min-w-full overflow-hidden"
      >
        {width && height && (
          <MemoCanvasBackground width={width} height={height} />
        )}
        {!nav && router.pathname === "/" && <>{children}</>}
        {!nav && router.pathname !== "/" && (
          <div className="flex flex-col w-full">
            <p
              className="text-3xl sm:text-4xl ml-auto pt-6 pr-6 md:pt-8 md:pr-8 cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Name Remember
            </p>
            {children}
          </div>
        )}
        {nav && (
          // Row layout for mobile, column layout for desktop, items hidden based on media query
          <>
            <div className="flex flex-row md:flex-col justify-stretch w-full md:max-w-min mx-auto md:mx-0 border-b md:border-b-0 md:border-r border-black">
              <div className="md:mx-4 my-6 ml-6 mr-auto flex flex-row">
                <div className="md:hidden my-auto mr-2">
                  <BackButton justChevron />
                </div>
                <div
                  className="text-3xl sm:text-4xl"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Name Remember
                </div>
              </div>
              <div className="hidden md:block mx-4 mb-8">
                <FeedbackForm />
              </div>
              <div className="hidden md:block">
                <BackButton />
              </div>
              <UserEmblem />
            </div>
            {children}
          </>
        )}
      </main>
    </>
  );
}
