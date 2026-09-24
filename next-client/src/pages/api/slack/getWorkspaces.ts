import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Session } from "@/utils/types";
import sql from "@/lib/pgConnect";

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

  try {
    const { rows } = await sql({
      query: `
        SELECT *
        FROM users
        WHERE email = $1;`,
      values: [session.user.email],
    });
    const workspaces = await sql({
      query: `
      SELECT workspace_id, workspace_name
      FROM slack_workspaces
      WHERE user_id = $1;`,
      values: [rows[0].id],
    });
    res.status(200).json(workspaces.rows as any);
    return;
  } catch (error: any) {
    res.status(500).json("" + error);
    return;
  }
}
