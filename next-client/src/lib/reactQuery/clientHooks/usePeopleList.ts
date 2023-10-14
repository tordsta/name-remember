import { Person } from "@/utils/types";
import { UseQueryResult, useQuery } from "react-query";

type FetchPeopleListData = {
  id: string;
  name: string;
  rrule: string;
  people_in_list: Array<Person>;
};

export const usePeopleList = ({
  id,
}: {
  id: string | null;
}): UseQueryResult<FetchPeopleListData | null> => {
  return useQuery(["peopleList", id], async () => {
    if (!id) {
      id = "";
    }
    const response = await fetch("/api/crud/getList?id=" + id);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data: FetchPeopleListData | null = null;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON:", e);
    }
    return data;
  });
};
