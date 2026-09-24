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

  const workspaceId: string | undefined = JSON.parse(req.body).workspaceId;
  if (!workspaceId) {
    res.status(400).json("Error bad request");
    return;
  }

  const token = await slackGetAccessToken({ session, workspaceId });
  if (!token) {
    res.status(500).json("Error no token");
    return;
  }

  try {
    const response = await slackClient.users.conversations({
      token: token,
      types: "public_channel,private_channel",
    });
    if (!response.ok) {
      res.status(500).json("Error getting members");
      return;
    }

    res.status(200).json(response.channels as any);
    return;
  } catch (error: any) {
    slackErrorLogger({ error, route: "users.conversations" });
    res.status(500).json("" + error);
    return;
  }
}
