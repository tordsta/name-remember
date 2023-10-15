import { notifyPromiseFetch } from "@/components/Notify";
import { Person } from "@/utils/types";
import { useMutation, useQueryClient } from "react-query";

const updatePeople = async ({ person }: { person: Person }) => {
  await notifyPromiseFetch({
    url: "/api/crud/updatePerson",
    body: JSON.stringify({ person }),
    pending: "... processing",
    success: `Updated ${person.fname}`,
    error: "Error: Could not update information.",
  });
};

const useUpdatePeople = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePeople, {
    onSettled: () => {
      queryClient.invalidateQueries(["peopleList"]);
    },
  });
};

export default useUpdatePeople;
