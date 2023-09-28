import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { stripeServer } from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Unauthorized");
    return;
  }

  try {
    const product = await stripeServer.products.retrieve(
      process.env.STRIPE_PREMIUM_PRODUCT_ID!
    );
    if (!product) res.status(404).json("Product not found");
    //Return an array of products
    res.status(200).json([product] as unknown as string);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error writing document: " + error);
    return;
  }
}
