import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import postmark from "postmark";

type List = {
  id: string;
  createdAt: string;
  updatedAt: string;
  owner_id: string;
  name: string;
  reminder_trigger_time: string | null;
  trigger_frequency: string | null;
};

var client = new postmark.ServerClient(process.env.POSTMARK_API_KEY as string);

const sendEmail = (list: List) => {
  client.sendEmail({
    From: "reminders@nameremember.com",
    To: "test@nameremember.com",
    Subject: "Test",
    TextBody: `Hello from Postmark! List id: ${list.id}`,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Starting hourlyMailSender");

  let rows;
  try {
    //join user on people_lists.owner_id = user.id, to get email
    const res = await sql`
        SELECT * FROM people_lists
        WHERE reminder_trigger_time <= NOW()
    `;
    rows = res.rows;
  } catch (error) {
    console.error("Failed to fetch people_lists", error);
    res
      .status(500)
      .json({ error: "Failed to fetch people_lists", details: error });
    return;
  }
  console.log("res ", rows);

  for (let i = 0; i < rows.length; i++) {
    const list = rows[i];
    try {
      sendEmail(list as List);
    } catch (error) {
      console.error("Error while sending email", error, "TO: ", list.owner_id);
      continue;
    }
  }

  for (let i = 0; i < rows.length; i++) {
    console.log("updating reminder_trigger_time", rows[i]);
    const list = rows[i];
    try {
      const res = await sql`
        UPDATE people_lists
        SET reminder_trigger_time = NOW() + INTERVAL '${list.trigger_frequency}'
        WHERE id = ${list.id}
        `;
    } catch (error) {
      console.error(
        `Failed to update reminder_trigger_time for list id: ${list.id}`,
        error
      );
      continue;
    }
  }

  res.status(200).end("Emails sent!");
}
