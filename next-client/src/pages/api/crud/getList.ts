import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import getList from "@/database/getList";
import { Session } from "@/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  const listId = req.query.id;
  let data;

  try {
    if (typeof listId !== "string") throw new Error("Missing list id!");
    data = await getList({ listId, session });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error querying people_lists" + error);
    return;
  }
  res.status(200).json(data);
  return;
}
