import { notifyPromiseFetch } from "@/components/Notify";
import { Person } from "@/utils/types";
import { useMutation, useQueryClient } from "react-query";

const addPeople = async ({
  listId,
  person,
}: {
  listId: string;
  person: Person;
}) => {
  await notifyPromiseFetch({
    url: "/api/crud/createPerson",
    body: JSON.stringify({ listId, person }),
    pending: "... processing",
    success: `${person.fname} added to list!`,
    error: "Error: Could not add person.",
  });
};

const useAddPeople = () => {
  const queryClient = useQueryClient();
  return useMutation(addPeople, {
    onSettled: () => {
      queryClient.invalidateQueries(["peopleList"]);
    },
  });
};

export default useAddPeople;
