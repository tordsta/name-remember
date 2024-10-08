import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import getLists from "@/lib/reactQuery/serverHydration/getLists";
import { Session } from "@/utils/types";

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
    const data: any = await getLists({ session });
    res.status(200).json(data);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error querying people_lists" + error);
    return;
  }
}
