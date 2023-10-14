import { UseQueryResult, useQuery } from "react-query";

type FetchPeopleListsData = Array<{
  id: string;
  name: string;
  owner_id: string;
  rrule: string;
  people_in_lists_count: string;
}>;

export const usePeopleLists = (): UseQueryResult<FetchPeopleListsData> => {
  return useQuery("peopleLists", async () => {
    const response = await fetch("/api/crud/getLists");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  });
};
