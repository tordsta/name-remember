import Layout from "@/components/Layout";
import Lists from "@/components/Lists";
import { getServerSession } from "next-auth";
import { QueryClient, dehydrate } from "react-query";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import getLists from "@/database/getLists";
import { usePeopleLists } from "@/hooks/usePeopleLists";

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

  return (
    <Layout>
      <div className="flex flex-col md:flex-col flex-grow w-full justify-start md:justify-between items-center">
        <Lists data={data} isLoading={isLoading} isError={isError} />
      </div>
    </Layout>
  );
}
