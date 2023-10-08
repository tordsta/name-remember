import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const email = req.body.email || null;
  const password = req.body.password || null;

  if (!password || !email) {
    console.log("Missing password or email", JSON.stringify(req.body));
    res.status(400).json("Missing variables");
    return;
  }

  // check if email exists
  // create password hash and salt
  // create user

  try {
    // await sql({
    //   query: `
    //     INSERT INTO user_feedback (email, type, message, file)
    //     VALUES ($1, $2, $3, $4)`,
    //   values: [email, type, message, file],
    // });
    res.status(200).json("Success");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
