import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Session } from "@/utils/types";
import { slackTradeCodeForToken, storeSlackToken } from "@/lib/slack";

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
  const code: string | undefined = req.body.code;
  const state: string | undefined = req.body.state;

  if (code) {
    const resToken = await slackTradeCodeForToken(code);
    if (!resToken || !resToken.authed_user) {
      res.status(500).json("Error getting token");
      return;
    }

    const success = await storeSlackToken({ response: resToken, session });
    if (!success) {
      res.status(500).json("Error storing token");
      return;
    }
  }
  res.status(200).json("success");
  return;
}
