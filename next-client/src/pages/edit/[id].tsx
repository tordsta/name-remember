import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { GetServerSidePropsContext } from "next";
import { usePeopleList } from "@/hooks/usePeopleList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import List from "@/components/List";
import useDeleteList from "@/hooks/useDeletePeopleList";

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
    <div>
      <h1>Remember Page</h1>
      <p>ID: {id}</p>
      <p>Data: {JSON.stringify(data)}</p>
      <List currentList={typeof id == "string" ? id : null} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (typeof id == "string") deleteList.mutate(id);
          router.push("/");
        }}
      >
        Delete
      </button>
    </div>
  );
}
