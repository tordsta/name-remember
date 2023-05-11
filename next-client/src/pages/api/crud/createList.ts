import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // const session = await getServerSession(req, res, authOptions);
  // if (session) {
  //   const { email } = session.user?.email ? session.user : { email: null };
  //   const name = req.query.name;
  //   if (!name || !email) {
  //     res.status(400).json("Missing name or email");
  //     res.end();
  //     return;
  //   }
  //   //    db.collection('users').doc(user_id).set({foo:'bar'}, {merge: true})
  //   const listsRef = collection(db, "lists");
  //   await setDoc(
  //     doc(listsRef, name + "_" + email),
  //     {
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       owner: email,
  //       name: name,
  //       people: [],
  //     },
  //     { merge: true }
  //   )
  //     .then(() => {
  //       res.status(200).json("Document successfully written!");
  //     })
  //     .catch((error) => {
  //       res.status(500).json("Error writing document: " + error);
  //     });
  // } else {
  //   res.status(401);
  // }
  // res.end();
}
