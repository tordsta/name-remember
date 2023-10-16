import postmarkClient from "./postmarkClient";

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

  const client = postmarkClient();

  try {
    client.sendEmailWithTemplate({
      From: "Name Remember <noreply@nameremember.com>",
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
