import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("hourlyMailSender");
  var postmark = require("postmark");

  // Send an email:
  var client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

  client.sendEmail({
    From: "reminders@nameremember.com",
    To: "recipient@example.com",
    Subject: "Test",
    TextBody: "Hello from Postmark!",
  });

  res.status(200).end("Hello Cron!");
}
