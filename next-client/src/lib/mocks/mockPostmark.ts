import type { ServerClient, TemplatedMessage } from "postmark";

// Logs emails instead of sending them. Links in the template model (email
// verification, password reset, memorizer reminders) can be opened straight
// from the server log.
const mockPostmark = {
  async sendEmailWithTemplate(message: TemplatedMessage) {
    console.log(
      `[mock:postmark] "${message.TemplateAlias}" to ${message.To}`,
      JSON.stringify(message.TemplateModel, null, 2)
    );
    return {
      To: message.To,
      SubmittedAt: new Date().toISOString(),
      MessageID: "mock",
      ErrorCode: 0,
      Message: "OK",
    };
  },
} as unknown as ServerClient;

export default mockPostmark;
