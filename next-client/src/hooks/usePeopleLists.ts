import { UseQueryResult, useQuery } from "react-query";

interface FetchPeopleListData
  extends Array<{ id: string; data: { name: string; owner: string } }> {}

export const usePeopleLists = (): UseQueryResult<FetchPeopleListData> => {
  return useQuery("peopleLists", async () => {
    const response = await fetch("/api/crud/getLists");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  });
};
