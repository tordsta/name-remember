import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const createList = async (name: string) => {
  await notifyPromiseFetch({
    url: "/api/crud/createList?name=" + name,
    pending: "... processing",
    success: `List ${name} created!`,
    error: "Error: Could not create list.",
  });
};

const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation(createList, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peopleLists"] });
    },
  });
};

export default useCreateList;
