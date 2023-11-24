import { FramedButton } from "@/components/Button";
import Layout from "@/components/navigation/Layout";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";

export default function SlackApp({
  providers,
}: {
  providers: {
    [key: string]: {
      id: string;
      name: string;
      type: string;
      signinUrl: string;
      callbackUrl: string;
    };
  };
}) {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_SLACK_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SLACK_APP_REDIRECT_URI;
  const code = router.query.code;
  const state = router.query.state;

  const session = useSession();

  useEffect(() => {
    if (code) {
      fetch(`/api/slack/oauth`, {
        method: "POST",
        body: JSON.stringify({ code, state, redirectUri }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          router.replace("/slack-app", undefined, { shallow: true });
        }
      });
    }
  }, [code, state, router, redirectUri]);

  return (
    <Layout auth={false} nav={false}>
      <div className="flex flex-col gap-4 m-10 md:mx-20 md:my-10">
        <h1 className="text-3xl">
          Integrate NameRemember with Your Slack Workspace
        </h1>
        <p>
          NameRemember, the app designed to help you match names to faces, now
          offers an Slack integration. With just a few clicks, harness the power
          of NameRemember directly within your Slack workspace.
        </p>
        <div className="block md:hidden">
          {session.status === "loading" && <p>Loading...</p>}
          {session.status === "unauthenticated" &&
            Object.values(providers)
              .filter((provider) => provider.name == "Slack")
              .map((provider) => (
                <div
                  key={provider.name}
                  className="flex flex-col justify-center items-center text-center gap-2 my-2"
                >
                  <p>Log in with {provider.name} before connecting</p>
                  <FramedButton onClick={() => signIn(provider.id)}>
                    Log in with {provider.name}
                  </FramedButton>
                </div>
              ))}
          {session.status === "authenticated" && (
            <div className="flex justify-center items-center">
              <FramedButton
                width={250}
                onClick={() => {
                  router.push(
                    `https://slack.com/oauth/v2/authorize?
                  user_scope=channels:read,groups:read,users.profile:read&
                  redirect_uri=${redirectUri}&
                  client_id=${clientId}`
                  );
                }}
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  Connect to Slack
                  <Image
                    src={"/slack.svg"}
                    width={20}
                    height={20}
                    alt={"Slack icon"}
                  />
                </div>
              </FramedButton>
            </div>
          )}
        </div>

        <p className="text-xl">Key Feature:</p>
        <ul className="ml-5">
          <li>
            - Effortless Integration: Connect NameRemember with your Slack
            workspace in seconds.
          </li>
          <li>
            - Automated Memorization Lists: Generate lists from your Slack
            channels effortlessly.
          </li>
          <li>
            - Interactive Learning: Engage with names and faces through
            interactive quizzes and reminders.
          </li>
          <li>
            - Privacy-Centric: We value your privacy. NameRemember only uses
            information you choose to share.
          </li>
        </ul>
        <p className="text-xl">Step-by-Step Integration Guide:</p>
        <ol className="ml-5">
          <li>1. Sign in and return to www.nameremember.com/slack-app.</li>
          <li>
            2. Connect with your Slack workspace: Click &apos;Connect to
            Slack&apos; below to initiate the integration process.
          </li>
          <li>
            3. Authorize & Confirm: Grant NameRemember access to your Slack
            workspace. We request only necessary permissions to create
            memorization lists from your channels.
          </li>
          <li className="flex flex-col gap-2 mb-3 justify-center items-center text-left w-full">
            <p className="w-full">
              4. Import slack channel: Create a list, click edit, import members
              from your slack channels.
            </p>
            <FramedButton onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </FramedButton>
          </li>
          <li>
            5. Start Memorizing: Dive into a your learning journey, and never
            forget a name again!
          </li>
        </ol>
        <p>
          Don&apos;t let another name slip your mind. Integrate NameRemember
          with your Slack workspace today and improve the way you connect with
          your coworkers!
        </p>
        {session.status === "loading" && <p>Loading...</p>}
        {session.status === "unauthenticated" &&
          Object.values(providers)
            .filter((provider) => provider.name == "Slack")
            .map((provider) => (
              <div
                key={provider.name}
                className="flex flex-col justify-center items-center text-center gap-2 my-2"
              >
                <p>Log in with {provider.name} before connecting</p>
                <FramedButton onClick={() => signIn(provider.id)}>
                  Log in with {provider.name}
                </FramedButton>
              </div>
            ))}
        {session.status === "authenticated" && (
          <div className="flex justify-center items-center">
            <FramedButton
              width={250}
              onClick={() => {
                router.push(
                  `https://slack.com/oauth/v2/authorize?
                user_scope=channels:read,groups:read,users.profile:read&
                redirect_uri=${redirectUri}&
                client_id=${clientId}`
                );
              }}
            >
              <div className="flex flex-row justify-center items-center gap-2">
                Connect to Slack
                <Image
                  src={"/slack.svg"}
                  width={20}
                  height={20}
                  alt={"Slack icon"}
                />
              </div>
            </FramedButton>
          </div>
        )}
        <p>NameRemember - Remember Names, Build Better Connections.</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers: providers ?? [],
    },
  };
}
