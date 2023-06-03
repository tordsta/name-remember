import * as postmark from "postmark";

export default function sendMemorizerReminder({
  recipientEmail,
  recipientName,
  listName,
  memorizerUrl,
}: {
  recipientEmail: string;
  recipientName: string;
  listName: string;
  memorizerUrl: string;
}) {
  if (typeof window !== "undefined") {
    throw new Error("Mail functions should not be executed on the client");
  }
  const apiKey = process.env.POSTMARK_API_KEY;
  if (typeof apiKey === "undefined") throw new Error("No API key");

  const { ServerClient } = postmark;
  const client = new ServerClient(apiKey);

  try {
    client.sendEmailWithTemplate({
      From: "noreply@nameremember.com",
      To: recipientEmail,
      TemplateAlias: "memorizer-reminder",
      TemplateModel: {
        name: recipientName,
        list_name: listName,
        action_url: memorizerUrl,
      },
    });
  } catch (error) {
    console.error("Error while sending email", error);
  }
}
