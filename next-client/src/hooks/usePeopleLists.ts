import { UseQueryResult, useQuery } from "react-query";

type FetchPeopleListData = Array<{
  id: string;
  name: string;
  owner_id: string;
}>;

export const usePeopleLists = (): UseQueryResult<FetchPeopleListData> => {
  return useQuery("peopleLists", async () => {
    const response = await fetch("/api/crud/getLists");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = JSON.parse(await response.json());
    return data;
  });
};
