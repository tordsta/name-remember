import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/utils/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const { email } = session.user?.email ? session.user : { email: null };
    const name = req.query.name;
    if (!name || !email) {
      res.status(400).json("Missing name or email");
      res.end();
      return;
    }

    const listsRef = collection(db, "lists");
    await deleteDoc(doc(listsRef, name + "_" + email))
      .then(() => {
        res.status(200).json("Document successfully written!");
      })
      .catch((error) => {
        res.status(500).json("Error writing document: " + error);
      });
  } else {
    res.status(401);
  }
  res.end();
}
