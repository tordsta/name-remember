import * as postmark from "postmark";
import { mocked } from "../integrations";
import mockPostmark from "../mocks/mockPostmark";

export default function postmarkClient() {
  if (typeof window !== "undefined") {
    throw new Error("Mail functions should not be executed on the client");
  }
  if (mocked.postmark) return mockPostmark;

  const apiKey = process.env.POSTMARK_API_KEY;
  if (typeof apiKey === "undefined") throw new Error("No API key");

  const { ServerClient } = postmark;
  const client = new ServerClient(apiKey);

  return client;
}
