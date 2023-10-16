import postmarkClient from "./postmarkClient";

export default async function sendResetPasswordEmail({
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

  const client = postmarkClient();

  client.sendEmailWithTemplate({
    From: "noreply@nameremember.com",
    To: recipientEmail,
    TemplateAlias: "reset-password",
    TemplateModel: {
      name: recipientName,
      action_url: tokenUrl,
    },
  });
}
