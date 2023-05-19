import { UseQueryResult, useQuery } from "react-query";

type FetchPeopleListData = {
  id: string;
  name: string;
  owner_id: string;
};

export const usePeopleList = ({
  id,
}: {
  id: string | null;
}): UseQueryResult<FetchPeopleListData> => {
  return useQuery(["peopleLists", id], async () => {
    if (!id) {
      id = "";
    }
    const response = await fetch("/api/crud/getList?id=" + id);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: FetchPeopleListData = await JSON.parse(await response.json());
    return data;
  });
};
