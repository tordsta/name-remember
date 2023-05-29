import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const addReminder = async ({
  listId,
  rrule,
  rruleStart,
}: {
  listId: string;
  rrule: string;
  rruleStart: number;
}) => {
  await notifyPromiseFetch({
    url: "/api/crud/addReminder",
    body: JSON.stringify({ listId, rrule, rruleStart }),
    pending: "... processing",
    success: `Reminder updated!`,
    error: "Error: Could not update reminder.",
  });
};

const useAddReminder = () => {
  const queryClient = useQueryClient();
  return useMutation(addReminder);
};

export default useAddReminder;
