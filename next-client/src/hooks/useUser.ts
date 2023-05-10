import { useQuery } from "react-query";

const fetchUser = async () => {
  const response = await (await fetch("/api/crud/getUser")).json();
  return response;
};

const useUser = () => {
  return useQuery("user", () => fetchUser());
};

export { useUser, fetchUser };
