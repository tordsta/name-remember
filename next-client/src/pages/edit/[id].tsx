import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { GetServerSidePropsContext } from "next";
import { usePeopleList } from "@/hooks/usePeopleList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import ListOfPeople from "@/components/ListOfPeople";
import useDeleteList from "@/hooks/useDeletePeopleList";
import { FramedButton } from "@/components/Button";
import Layout from "@/components/navigation/Layout";
import AddPersonToListModal from "@/components/AddPersonToListModal";
import ReminderInput from "@/components/ReminderInput";
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

export default function EditListPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isError, isLoading } = usePeopleList({ id: id as string });
  const deleteList = useDeleteList();

  useEffect(() => {
    trackAmplitudeData("Loaded Page Edit List", { id: id });
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error :</p>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row-reverse justify-start md:justify-evenly min-h-screen w-full items-center">
        <div className="flex flex-col items-center justify-center gap-4 mt-8 md:mt-0">
          <p className="text-3xl">{data?.name}</p>
          {typeof id === "string" && (
            <ReminderInput id={id} rrule={data?.rrule} />
          )}
          {typeof id === "string" && (
            <div className="block">
              <AddPersonToListModal listId={id} />
            </div>
          )}
          <div className="hidden md:block">
            <FramedButton
              onClick={(e) => {
                e.stopPropagation();
                trackAmplitudeData("Clicked Delete List", { id: id });
                if (typeof id == "string") deleteList.mutate(id);
                router.push("/dashboard");
              }}
            >
              <p className=" text-red-500">Delete group</p>
            </FramedButton>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-16 mt-8 md:mb-16">
          {typeof id === "string" && <ListOfPeople currentList={id} />}
          <div className="block md:hidden mt-8">
            <FramedButton
              onClick={(e) => {
                e.stopPropagation();
                trackAmplitudeData("Clicked Delete List", { id: id });
                if (typeof id == "string") deleteList.mutate(id);
                router.push("/dashboard");
              }}
            >
              <p className=" text-red-500">Delete group</p>
            </FramedButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}
