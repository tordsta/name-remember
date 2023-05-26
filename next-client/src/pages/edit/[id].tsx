import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { GetServerSidePropsContext } from "next";
import { usePeopleList } from "@/hooks/usePeopleList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import ListOfPeople from "@/components/ListOfPeople";
import useDeleteList from "@/hooks/useDeletePeopleList";
import { FramedButton } from "@/components/style/Button";
import Layout from "@/components/Layout";
import AddPersonToListModal from "@/components/AddPersonToListModal";

//TODO - make a new folder with database fetches getList, etc.
//not in api folder
//getList needs id, and session to check and execute!
async function fetchList(id: string) {
  const response = await fetch("/api/crud/getList?id=" + id);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);

  const queryClient = new QueryClient();
  const { id } = context.params?.id ? context.params : { id: "" };

  //TODO
  //where to prefetch?
  //add export usePrefetchPeopleList to usePeopleList hook?
  //await usePrefetchPeopleList({ id: id as string, session: session });
  await queryClient.prefetchQuery(["peopleList", id], () =>
    fetchList(id as string)
  );

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error :</p>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row-reverse justify-start md:justify-evenly min-h-screen w-full items-center">
        <div className="flex flex-col items-center justify-center gap-4 mt-8 md:mt-0">
          <p className="text-3xl">Edit List: {data?.name}</p>
          {/* TODO make reminder edits for mail here */}
          <FramedButton
            onClick={(e) => {
              e.stopPropagation();
              if (typeof id == "string") deleteList.mutate(id);
              router.push("/");
            }}
          >
            <p className=" text-red-500">Delete group</p>
          </FramedButton>
          {typeof id === "string" && (
            <div className="hidden md:block">
              <AddPersonToListModal listId={id} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* add modal with where user confirmation deletion */}
          {typeof id === "string" && <ListOfPeople currentList={id} />}
          {typeof id === "string" && (
            <div className="md:hidden">
              <AddPersonToListModal listId={id} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
