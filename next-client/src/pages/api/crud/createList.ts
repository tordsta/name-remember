import { collection, doc, setDoc } from "firebase/firestore";
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
    if (!name) {
      res.status(400).json("Missing name");
      res.end();
      return;
    }

    const listsRef = collection(db, "lists");
    const qres = await setDoc(doc(listsRef, ""), {
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
      regions: ["west_coast", "norcal"],
    });
    console.log("Document written", JSON.stringify(qres));

    res.status(200).json(JSON.stringify(qres));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
