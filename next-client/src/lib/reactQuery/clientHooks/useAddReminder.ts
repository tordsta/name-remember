import { notifyPromiseFetch } from "@/components/Notify";
import { useMutation, useQueryClient } from "react-query";

const addReminder = async ({
  listId,
  rrule,
  rruleStart,
  nextReminder,
}: {
  listId: string;
  rrule: string;
  rruleStart: number;
  nextReminder: number | null;
}) => {
  await notifyPromiseFetch({
    url: "/api/crud/createReminder",
    body: JSON.stringify({ listId, rrule, rruleStart, nextReminder }),
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
