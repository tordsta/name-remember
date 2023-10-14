import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const deletePeople = async (id: string) => {
  return await notifyPromiseFetch({
    url: "/api/crud/deletePerson?id=" + id,
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
