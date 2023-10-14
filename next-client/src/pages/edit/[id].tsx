import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { GetServerSidePropsContext } from "next";
import { usePeopleList } from "@/lib/reactQuery/clientHooks/usePeopleList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import ListOfPeople from "@/components/ListOfPeople";
import useDeleteList from "@/lib/reactQuery/clientHooks/useDeletePeopleList";
import { FramedButton } from "@/components/Button";
import Layout from "@/components/navigation/Layout";
import AddPersonToListModal from "@/components/AddPersonToListModal";
import ReminderInput from "@/components/ReminderInput";
import getList from "@/lib/reactQuery/serverHydration/getList";
import { Session } from "@/utils/types";
import DeleteListButton from "@/components/DeleteListButton";

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

export default function EditListPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isError, isLoading } = usePeopleList({ id: id as string });
  const deleteList = useDeleteList();

  useEffect(() => {
    trackAmplitudeData("Loaded Page Edit List", { id: id });
  }, [id]);

  if (isLoading || typeof id !== "string") return <p>Loading...</p>;
  if (isError) return <p>Error :</p>;

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center w-full mb-8">
        <p className="text-3xl mt-8">{data?.name}</p>
        <div className="flex flex-col md:flex-row-reverse justify-start md:justify-evenly w-full items-center">
          <div className="flex flex-col items-center justify-center gap-4 mt-8 md:mt-0">
            <ReminderInput id={id} rrule={data?.rrule} />
          </div>
          <div className="flex flex-col items-center justify-center mb-16 mt-8 md:mb-16 gap-6">
            <ListOfPeople currentList={id} />
            <AddPersonToListModal listId={id} />
          </div>
        </div>
        <DeleteListButton listId={id} />
      </div>
    </Layout>
  );
}
