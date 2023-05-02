import type { NextApiRequest, NextApiResponse } from "next";

import { initFirestore } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";

const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
  }),
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const firestore = initFirestore(firebaseConfig);

//const analytics = getAnalytics(app);

// export async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<string>
// ) {
//   const querySnapshot = await getDocs(collection(firestoreDB, "users"));
//   let users: { id: string; data: DocumentData }[] = [];
//   querySnapshot.forEach((doc) => {
//     users.push({ id: doc.id, data: doc.data() });
//   });
//   const querySuccess = querySnapshot.empty ? false : true;
//   res.status(200).json("Firestore connection status: " + querySuccess);
// }
