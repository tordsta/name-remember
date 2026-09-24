import { useQuery } from "react-query";

const fetchSlackConversations = async (workspaceId: string) => {
  const response = await (
    await fetch("/api/slack/getChannels", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    })
  ).json();
  return response;
};

const useSlackConversations = (workspaceId: string | null) => {
  return useQuery(["slackConversations", workspaceId], () =>
    workspaceId ? fetchSlackConversations(workspaceId) : null
  );
};

export { useSlackConversations };
