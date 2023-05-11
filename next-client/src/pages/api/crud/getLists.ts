import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // const session = await getServerSession(req, res, authOptions);
  // if (session) {
  //   const { email } = session.user?.email ? session.user : { email: null };
  //   if (!email) {
  //     res.status(401).json(JSON.stringify("No email found"));
  //     res.end();
  //   }
  //   let lists: Array<Object> = [];
  //   const listsRef = collection(db, "lists");
  //   const qLists = query(listsRef, where("owner", "==", email));
  //   const querySnapshot = await getDocs(qLists);
  //   querySnapshot.forEach((doc) => {
  //     lists.push({ id: doc.id, data: doc.data() });
  //   });
  //   res.status(200).json(JSON.stringify(lists));
  // } else {
  //   res.status(401);
  // }
  // res.end();
}
