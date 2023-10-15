import postmarkClient from "./postmarkClient";

export default async function sendNewFeedbackMail({
  recipientEmail,
  type,
  file_upload,
  message,
}: {
  recipientEmail: string;
  type: string;
  file_upload: boolean;
  message: string;
}) {
  if (typeof window !== "undefined") {
    throw new Error("Mail functions should not be executed on the client");
  }

  const client = postmarkClient();

  client.sendEmailWithTemplate({
    From: "noreply@nameremember.com",
    To: recipientEmail,
    TemplateAlias: "new-feedback",
    TemplateModel: {
      type: type,
      file_upload: file_upload,
      message: message,
    },
  });
}
