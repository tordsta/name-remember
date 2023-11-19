import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Session } from "@/utils/types";
import {
  slackClient,
  slackErrorLogger,
  slackGetAccessToken,
} from "@/lib/slack";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session: Session | null | undefined = await getServerSession(
    req,
    res,
    authOptions as any
  );
  if (!session) {
    res.status(401).json("Unauthorized");
    return;
  }
  const conversationId: string | undefined = JSON.parse(
    req.body
  ).conversationId;
  const workspaceId: string | undefined = JSON.parse(req.body).workspaceId;
  if (!conversationId || !workspaceId) {
    res.status(400).json("Error no channel id");
    return;
  }

  const token = await slackGetAccessToken({ session, workspaceId });
  if (!token) {
    res.status(500).json("Error no token");
    return;
  }

  try {
    const response = await slackClient.conversations.members({
      token: token,
      channel: conversationId,
    });
    if (!response.members || !response.ok) {
      res.status(500).json("Error getting members");
      return;
    }
    const members = [];
    for (const member of response.members) {
      const response = await slackClient.users.profile.get({
        token: token,
        user: member,
      });
      if (!response.ok) {
        console.log("Error getting user profile", response);
        continue;
      }
      members.push(response.profile);
    }
    res.status(200).json(members as any);
    return;
  } catch (error: any) {
    slackErrorLogger({
      error,
      route: "conversations.members | users.profile.get",
    });
    res.status(500).json("" + error);
    return;
  }
}
