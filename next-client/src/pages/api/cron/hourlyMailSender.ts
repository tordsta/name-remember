import sendMemorizerReminder from "@/utils/sendMemorizerReminder";
import sql from "@/database/pgConnect";
import { NextApiRequest, NextApiResponse } from "next";
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
  user_name: string;
};

const sendEmail = (list: List) => {
  sendMemorizerReminder({
    recipientEmail: list.email,
    recipientName: list.user_name,
    listName: list.name,
    memorizerUrl: "https://nameremember.com/memorize/" + list.id,
  });
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Starting hourlyMailSender");

  let rows: List[] = [];
  const maxRetries = 3;
  const delayMs = 10000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await sql({
        query: `
          SELECT people_lists.*, users.email, users.name as user_name 
          FROM people_lists
          INNER JOIN users 
          ON people_lists.owner_id = users.id
          WHERE people_lists.reminder_trigger_time <= NOW()
          AND people_lists.rrule IS NOT NULL
        `,
      });
      rows = res.rows as List[];
      break;
    } catch (error) {
      if (attempt < maxRetries) {
        console.log(`Fetch attempt ${attempt} failed, retrying...`);
        await delay(delayMs);
      } else {
        console.error("Failed to fetch people_lists", error);
        res
          .status(500)
          .json({ error: "Failed to fetch people_lists", details: error });
        return;
      }
    }
    console.log("Sending to: ", rows);
  }

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
      const res = await sql({
        query: `UPDATE people_lists
        SET reminder_trigger_time = to_timestamp($1)
        WHERE id = $2`,
        values: [nextTriggerTime, list.id],
      });
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
