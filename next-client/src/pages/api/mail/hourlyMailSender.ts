import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { ServerClient } from "postmark";
import { RRule } from "rrule";

type List = {
  id: string;
  createdAt: string;
  updatedAt: string;
  owner_id: string;
  name: string;
  reminder_trigger_time: string | null;
  trigger_frequency: string | null;
  rrule: string | null;
  rrule_start: string | null;
  email: string;
};

var client = new ServerClient(process.env.POSTMARK_API_KEY as string);

//TODO verify email before sending out
const sendEmail = (list: List) => {
  client.sendEmail({
    From: "reminders@nameremember.com",
    To: "test@nameremember.com",
    Subject: "Test",
    TextBody: `Hello from Postmark! List id: ${list.id}, list name: ${list.name}, email: ${list.email}`,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Starting hourlyMailSender");

  let rows;
  try {
    //TODO join user on people_lists.owner_id = user.id, to get email
    const res = await sql`
    SELECT people_lists.*, users.email 
    FROM people_lists
    INNER JOIN users 
    ON people_lists.owner_id = users.id
    WHERE people_lists.reminder_trigger_time <= NOW()
    AND people_lists.rrule IS NOT NULL
    `;
    rows = res.rows;
  } catch (error) {
    console.error("Failed to fetch people_lists", error);
    res
      .status(500)
      .json({ error: "Failed to fetch people_lists", details: error });
    return;
  }
  console.log("Sending to: ", rows);

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
    let nextTriggerTime = null;
    if (list.rrule) {
      let ruleOption = RRule.parseString(list.rrule);
      const rule = new RRule(ruleOption);
      const next = rule.after(new Date(), false);
      nextTriggerTime = next ? next.getTime() / 1000 : null;
    }
    try {
      const res = await sql`
        UPDATE people_lists
        SET reminder_trigger_time = to_timestamp(${nextTriggerTime})
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
  console.log("Finished hourlyMailSender");
  res.status(200).end("Emails sent!");
}
