import { useQuery } from "react-query";

const fetchUser = async () => {
  const response = await (await fetch("/api/crud/readUser")).json();
  return response;
};

const useUser = () => {
  return useQuery("user", () => fetchUser()).data;
};

export { useUser, fetchUser };
