import { NextApiRequest, NextApiResponse } from "next";

type Lists = {
  id: string;
  createdAt: string;
  updatedAt: string;
  owner_id: string;
  name: string;
  reminder_trigger_time: string | null;
  trigger_frequency: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("hourlyMailSender");

  var postmark = require("postmark");
  var client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
  const sendEmail = (list: Lists) => {
    client.sendEmail({
      From: "reminders@nameremember.com",
      To: list.owner_id,
      Subject: "Test",
      TextBody: `Hello from Postmark! List id: ${list.id}`,
    });
  };

  let rows;
  try {
    const res = await client.query(`
        SELECT * FROM people_lists
        WHERE reminder_trigger_time <= NOW()
    `);
    rows = res.rows;
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
    return;
  }
  console.log("res ", rows);

  for (let i = 0; i < rows.length; i++) {
    const list = rows[i];
    sendEmail(list);
  }

  for (let i = 0; i < rows.length; i++) {
    const list = rows[i];
    try {
      const res = await client.query(`
        UPDATE people_lists
        SET reminder_trigger_time = NOW() + INTERVAL ${list.trigger_frequency}
        WHERE id = ${list.id}
        `);
    } catch (error) {
      console.log(error);
      continue;
    }
  }

  res.status(200).end("Hello Cron!");
}
