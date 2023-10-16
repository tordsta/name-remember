import { notifyPromiseFetch } from "@/components/Notify";
import { Person } from "@/utils/types";
import { useMutation, useQueryClient } from "react-query";

const deletePeople = async ({ person }: { person: Person }) => {
  return await notifyPromiseFetch({
    url: "/api/crud/deletePerson",
    body: JSON.stringify({ person }),
    pending: "... processing",
    success: `Person deleted!`,
    error: "Error: Could not delete person.",
  });
};

const useDeletePeople = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePeople, {
    onSettled: () => {
      queryClient.invalidateQueries(["peopleList"]);
    },
  });
};

export default useDeletePeople;
