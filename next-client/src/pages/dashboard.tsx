import Layout from "@/components/navigation/Layout";
import Lists from "@/components/peopleLists/Lists";
import { getServerSession } from "next-auth";
import { QueryClient, dehydrate } from "react-query";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import getLists from "@/lib/reactQuery/serverHydration/getLists";
import { usePeopleLists } from "@/lib/reactQuery/clientHooks/usePeopleLists";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setAmplitudeUserId, trackAmplitudeData } from "@/lib/amplitude";
import { Session } from "@/utils/types";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;
  const session: Session | null | undefined = await getServerSession(
    req,
    res,
    authOptions as any
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["peopleLists"], () => {
    if (session) {
      const data = getLists({ session });
      return data;
    }
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Dashboard() {
  const { data, isLoading, isError } = usePeopleLists();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user && session.user.email) {
      console.log("setting amplitude user id", session.user.email);
      setAmplitudeUserId(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    trackAmplitudeData("Loaded Page Dashboard");
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-col flex-grow w-full justify-start md:justify-between items-center">
        <Lists data={data} isLoading={isLoading} isError={isError} />
      </div>
    </Layout>
  );
}
