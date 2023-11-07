import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { GetServerSidePropsContext } from "next";
import { usePeopleList } from "@/lib/reactQuery/clientHooks/usePeopleList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Memorization from "@/components/Memorization";
import Layout from "@/components/navigation/Layout";
import getList from "@/lib/reactQuery/serverHydration/getList";
import { Session } from "@/utils/types";
import LoadingPage from "@/components/navigation/LoadingPage";
import ErrorPage from "@/components/navigation/ErrorPage";

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
  const { id } = context.params?.id ? context.params : { id: "" };

  await queryClient.prefetchQuery(["peopleList", id], () => {
    if (typeof id === "string" && session) {
      return getList({ listId: id, session });
    }
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function MemorizeListPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isError, isLoading } = usePeopleList({ id: id as string });

  useEffect(() => {
    trackAmplitudeData("Loaded Page Memorize List", { id: id });
  }, [id]);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <Layout>
      <Memorization
        currentList={typeof id == "string" ? id : null}
        data={data}
        isError={isError}
        isLoading={isLoading}
      />
    </Layout>
  );
}
