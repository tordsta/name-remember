import { mocked } from "./integrations";

// Where the "Connect to Slack" buttons send the user. The redirect page
// (dashboard or /slack-app) trades the returned `code` via /api/slack/oauth.
// When Slack is mocked, slack.com is skipped and a mock code goes straight back.
export default function slackAuthorizeUrl(redirectUri: string | undefined) {
  if (mocked.slack) {
    const path = redirectUri
      ? new URL(redirectUri, window.location.origin).pathname
      : "/dashboard";
    return `${path}?code=mock`;
  }
  return (
    "https://slack.com/oauth/v2/authorize" +
    "?user_scope=channels:read,groups:read,users.profile:read" +
    `&redirect_uri=${encodeURIComponent(redirectUri ?? "")}` +
    `&client_id=${process.env.NEXT_PUBLIC_SLACK_ID}`
  );
}
