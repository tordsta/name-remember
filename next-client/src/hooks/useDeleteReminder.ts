import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const deleteReminder = async ({ listId }: { listId: string }) => {
  await notifyPromiseFetch({
    url: "/api/crud/deleteReminder",
    body: JSON.stringify({ listId }),
    pending: "... processing",
    success: `Reminder deleted!`,
    error: "Error: Could not delete reminder.",
  });
};

const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteReminder);
};

export default useDeleteReminder;
