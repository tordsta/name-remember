import { useQuery } from "react-query";

const fetchSlackWorkspaces = async () => {
  const response = await (await fetch("/api/slack/getWorkspaces")).json();
  return response;
};

const useSlackWorkspaces = () => {
  return useQuery("slackWorkspaces", () => fetchSlackWorkspaces());
};

export { useSlackWorkspaces };
