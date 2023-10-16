import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const deleteList = async (id: string) => {
  return await notifyPromiseFetch({
    url: "/api/crud/deleteList?id=" + id,
    pending: "... processing",
    success: `List deleted!`,
    error: "Error: Could not delete list.",
  });
};

const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteList, {
    onSettled: (id) => {
      queryClient.invalidateQueries(["peopleLists"]);
      queryClient.invalidateQueries(["peopleList", id]);
      queryClient.refetchQueries(["peopleLists"]);
    },
  });
};

export default useDeleteList;
