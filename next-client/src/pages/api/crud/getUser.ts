import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const { email } = session.user?.email ? session.user : { email: null };
    if (!email) {
      res.status(401).json(JSON.stringify("No email found"));
      res.end();
    }

    let userObj: Object = {};
    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(qUser);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      userObj = { id: doc.id, data: doc.data() };
    });

    res.status(200).json(JSON.stringify(userObj));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
