import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import getLists from "@/database/getLists";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
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
