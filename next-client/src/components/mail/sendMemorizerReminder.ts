import postmark from "postmark";

const client = new postmark.ServerClient(
  process.env.POSTMARK_API_KEY as string
);

export default async function sendMemorizerReminder({
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

  client.sendEmailWithTemplate({
    From: "noreply@namereminder.com",
    To: recipientEmail,
    TemplateAlias: "memorizer-reminder",
    TemplateModel: {
      name: recipientName,
      list_name: listName,
      action_url: memorizerUrl,
    },
  });
}
