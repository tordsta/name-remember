import { useEffect, useState } from "react";
import DefaultModal from "../Modal";
import Button, { FramedButton } from "../Button";
import AddPerson from "./AddPerson";
import { useUser } from "@/lib/reactQuery/clientHooks/useUser";
import { notifyInfo } from "../Notify";
import { useSlackWorkspaces } from "@/lib/reactQuery/clientHooks/useSlackWorkspaces";
import { useSlackConversations } from "@/lib/reactQuery/clientHooks/useSlackConversations";
import { useSlackMembers } from "@/lib/reactQuery/clientHooks/useSlackMembers";
import { useRouter } from "next/router";
import useAddPeople from "@/lib/reactQuery/clientHooks/useAddPeople";

export default function ImportSlackChannelModal({
  listId,
}: {
  listId: string;
}) {
  const [openSignal, setOpenSignal] = useState(false);
  const user = useUser();
  const workspaces = useSlackWorkspaces();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const conversations = useSlackConversations(workspaceId);
  const [channelId, setChannelId] = useState<string | null>(null);
  const members = useSlackMembers({ workspaceId, conversationId: channelId });

  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_SLACK_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SLACK_DASHBOARD_REDIRECT_URI;
  const addPeople = useAddPeople();

  const handleAddToList = async () => {
    for (const member of members.data) {
      const fname = member.first_name;
      const lname = member.last_name;
      const image_url = member.image_512;
      addPeople.mutate({
        listId: listId,
        person: {
          fname: fname,
          lname: lname,
          image_url: image_url,
        },
      });
    }
  };

  return (
    <>
      <FramedButton
        disabled={user?.subscription_plan !== "premium"}
        onClick={() => {
          setOpenSignal(true);
        }}
      >
        Import Slack Channel
      </FramedButton>
      <DefaultModal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col justify-center items-center">
          <p className="text-xl m-2">Import Slack Channel</p>
          <FramedButton
            width={250}
            onClick={() => {
              router.push(
                `https://slack.com/oauth/v2/authorize?
                          user_scope=channels:read,groups:read,users.profile:read&
                          redirect_uri=${redirectUri}&
                          client_id=${clientId}`
              );
            }}
          >
            Authorize new slack workspace
          </FramedButton>
          <div className="m-4 gap-2 grid grid-cols-3 grid-rows-[20px_1fr]">
            <h2 className="row-span-1 col-span-1 underline text-lg">
              Select workspace
            </h2>
            {workspaceId && (
              <h2 className="row-span-1 col-span-1 underline text-lg">
                Select channel
              </h2>
            )}
            {channelId && (
              <h2 className="row-span-1 col-span-1 underline text-lg">
                Select members
              </h2>
            )}
            <div className="row-start-2 row-end-3 col-start-1 col-end-2">
              {workspaces.isFetched &&
                workspaces.data.map(
                  (workspace: {
                    workspace_id: string;
                    workspace_name: string;
                  }) => {
                    return (
                      <div
                        className="cursor-pointer"
                        key={workspace.workspace_id}
                        onClick={() => setWorkspaceId(workspace.workspace_id)}
                      >
                        <div>{workspace.workspace_name} &gt;</div>
                      </div>
                    );
                  }
                )}
            </div>
            <div className="row-start-2 row-end-3 col-start-2 col-end-3">
              {conversations.isFetched &&
                conversations.data &&
                conversations.data.map((conversation: any) => {
                  return (
                    <div
                      className="cursor-pointer mb-1"
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
            <div className="row-start-2 row-end-3 col-start-3 col-end-4">
              {members.isFetched &&
                members.data &&
                members.data.map((member: any) => {
                  return <div key={member.real_name}>{member.real_name}</div>;
                })}
              {members.data && members.isFetched && (
                <button
                  onClick={handleAddToList}
                  className="border border-black px-2 py-1 text-sm mt-2 w-full"
                >
                  Add to list
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-2 mt-4">
            <Button onClick={() => setOpenSignal(false)}>Exit</Button>
          </div>
        </div>
      </DefaultModal>
    </>
  );
}
