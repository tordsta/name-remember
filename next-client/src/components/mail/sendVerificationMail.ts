import postmark from "postmark";

const client = new postmark.ServerClient(
  process.env.POSTMARK_API_KEY as string
);

export default async function sendVerificationMail({
  recipientEmail,
  recipientName,
  tokenUrl,
}: {
  recipientEmail: string;
  recipientName: string;
  tokenUrl: string;
}) {
  if (typeof window !== "undefined") {
    throw new Error("Mail functions should not be executed on the client");
  }

  client.sendEmailWithTemplate({
    From: "noreply@nameremember.com",
    To: recipientEmail,
    TemplateAlias: "confirm-email",
    TemplateModel: {
      name: recipientName,
      action_url: tokenUrl,
    },
  });
}
