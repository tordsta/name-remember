import type { NextApiRequest, NextApiResponse } from "next";

import { initializeApp } from "firebase/app";
import { DocumentData, getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebase = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(firebase);
//const analytics = getAnalytics(app);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const querySnapshot = await getDocs(collection(firestoreDB, "users"));
  let users: { id: string; data: DocumentData }[] = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, data: doc.data() });
  });
  const querySuccess = querySnapshot.empty ? false : true;
  res.status(200).json("Firestore connection status: " + querySuccess);
}
