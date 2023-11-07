import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const updateUser = async ({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) => {
  await notifyPromiseFetch({
    url: "/api/crud/updateUser",
    body: JSON.stringify({ image, name }),
    pending: "... processing",
    success: `Updated profile info.`,
    error: "Error: Could not update information.",
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onSettled: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.refetchQueries(["user"]);
    },
  });
};

export default useUpdateUser;
