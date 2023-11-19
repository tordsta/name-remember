import { useQuery } from "react-query";

const fetchSlackMembers = async ({
  workspaceId,
  conversationId,
}: {
  workspaceId: string;
  conversationId: string;
}) => {
  const response = await (
    await fetch("/api/slack/getMembers", {
      method: "POST",
      body: JSON.stringify({ workspaceId, conversationId }),
    })
  ).json();
  return response;
};

const useSlackMembers = ({
  workspaceId,
  conversationId,
}: {
  workspaceId: string | null;
  conversationId: string | null;
}) => {
  return useQuery(["slackMembers", workspaceId, conversationId], () =>
    workspaceId && conversationId
      ? fetchSlackMembers({ workspaceId, conversationId })
      : null
  );
};

export { useSlackMembers };
