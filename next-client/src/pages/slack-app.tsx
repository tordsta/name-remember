import { useSlackConversations } from "@/lib/reactQuery/clientHooks/useSlackConversations";
import { useSlackMembers } from "@/lib/reactQuery/clientHooks/useSlackMembers";
import { useSlackWorkspaces } from "@/lib/reactQuery/clientHooks/useSlackWorkspaces";
import { ConversationsMembersResponse } from "@slack/web-api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SlackApp() {
  const workspaces = useSlackWorkspaces();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const conversations = useSlackConversations(workspaceId);
  const [channelId, setChannelId] = useState<string | null>(null);
  const members = useSlackMembers({ workspaceId, conversationId: channelId });

  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_SLACK_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SLACK_APP_REDIRECT_URI;
  const code = router.query.code;
  const state = router.query.state;

  useEffect(() => {
    if (code) {
      fetch(`/api/slack/oauth`, {
        method: "POST",
        body: JSON.stringify({ code, state }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          router.replace("/slack-app", undefined, { shallow: true });
        }
      });
    }
  }, [code, state, router]);

  return (
    <div className="m-10">
      <h1>Slack App</h1>
      <h2>My slack workspaces</h2>
      <div className="flex flex-row">
        {workspaces.isFetched &&
          workspaces.data.map(
            (workspace: { workspace_id: string; workspace_name: string }) => {
              return (
                <div
                  key={workspace.workspace_id}
                  onClick={() => setWorkspaceId(workspace.workspace_id)}
                >
                  <div>{workspace.workspace_name} &gt;</div>
                </div>
              );
            }
          )}
        <div className="mx-2">
          {conversations.isFetched &&
            conversations.data &&
            conversations.data.map((conversation: any) => {
              return (
                <div
                  key={conversation.id}
                  onClick={async () => {
                    setChannelId(conversation.id);
                  }}
                >
                  {conversation.name} &gt;
                </div>
              );
            })}
        </div>
        <div className="mx-2">
          {members.isFetched &&
            members.data &&
            members.data.map((member: any) => {
              return <div key={member.real_name}>{member.real_name}</div>;
            })}
        </div>
        {members.isFetched && (
          <button className="border border-black px-3 py-2">Make list</button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="border border-black px-3 py-2"
          onClick={() => {
            router.push(
              `https://slack.com/oauth/v2/authorize?
            user_scope=channels:read,groups:read,users.profile:read&
            redirect_uri=${redirectUri}&
            client_id=${clientId}`
            );
          }}
          //style="align-items:center;color:#000;background-color:#fff;border:1px solid #ddd;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:16px;font-weight:600;height:48px;justify-content:center;text-decoration:none;width:236px"
        >
          {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          style="height:20px;width:20px;margin-right:12px"
          viewBox="0 0 122.8 122.8"
          >
          <path
          d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
          fill="#e01e5a"
          ></path>
          <path
          d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
          fill="#36c5f0"
          ></path>
          <path
          d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
          fill="#2eb67d"
          ></path>
          <path
          d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
          fill="#ecb22e"
          ></path>
        </svg> */}
          Import from Slack Workspace
        </button>
      </div>
    </div>
  );
}
