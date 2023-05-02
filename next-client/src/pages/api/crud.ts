import { db } from "@/utils/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  //   //@ts-ignore
  //   const citiesRef = collection(firestore, "cities");

  //   await setDoc(doc(citiesRef, "SF"), {
  //     name: "San Francisco",
  //     state: "CA",
  //     country: "USA",
  //     capital: false,
  //     population: 860000,
  //     regions: ["west_coast", "norcal"],
  //   });

  const querySnapshot = await getDocs(collection(db, "users"));
  let users: { id: string; data: DocumentData }[] = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, data: doc.data() });
  });
  const querySuccess = querySnapshot.empty ? false : true;
  res
    .status(200)
    .json("Firestore connection: " + querySuccess + JSON.stringify(users));
}
