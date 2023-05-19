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
    onMutate: async (id) => {
      await queryClient.cancelQueries(["peopleLists", id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peopleLists"] });
    },
    onSettled: (id) => {
      queryClient.invalidateQueries(["peopleLists", id]);
    },
  });
};

export default useDeleteList;
