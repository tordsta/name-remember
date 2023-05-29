import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { GetServerSidePropsContext } from "next";
import { usePeopleList } from "@/hooks/usePeopleList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Memorization from "@/components/Memorization";
import Layout from "@/components/Layout";
import getList from "@/database/getList";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error :</p>;

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
