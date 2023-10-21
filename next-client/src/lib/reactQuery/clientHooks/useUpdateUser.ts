import { notifyPromiseFetch } from "@/components/Notify";
import { Person } from "@/utils/types";
import { useMutation, useQueryClient } from "react-query";

const updateUser = async ({ image }: { image: string }) => {
  await notifyPromiseFetch({
    url: "/api/crud/updateUser",
    body: JSON.stringify({ image }),
    pending: "... processing",
    success: `Updated profile picture.`,
    error: "Error: Could not update information.",
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onSettled: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export default useUpdateUser;
