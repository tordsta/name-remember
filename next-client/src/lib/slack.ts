import { ErrorCode, OauthV2AccessResponse, WebClient } from "@slack/web-api";
import sql from "./pgConnect";
import { Session } from "@/utils/types";

export const slackClient = new WebClient();
const clientId = process.env.NEXT_PUBLIC_SLACK_ID;
const clientSecret = process.env.SLACK_SECRET;
const redirectUri = process.env.NEXT_PUBLIC_SLACK_APP_REDIRECT_URI;

export const slackTradeCodeForToken = async (code: string) => {
  try {
    if (!clientId || !clientSecret) {
      throw new Error("No slack client id or secret");
    }
    const resp = await slackClient.oauth.v2.access({
      client_id: clientId as string,
      client_secret: clientSecret as string,
      code,
      redirect_uri: redirectUri as string,
    });
    return resp;
  } catch (error: any) {
    slackErrorLogger({ error, route: "code oauth.v2.access" });
    return null;
  }
};

export const slackGetAccessToken = async (session: Session) => {
  let account;
  try {
    const user = await sql({
      query: `
          SELECT *
          FROM users
          WHERE email = $1;`,
      values: [session.user.email],
    });
    const { rows } = await sql({
      query: `
        SELECT *
        FROM accounts
        WHERE user_id = $1
            AND provider_id = $2
            AND token_type = $3;`,
      values: [user.rows[0].id, "slack", "user"],
    });
    account = rows[0];
  } catch (error: any) {
    console.log("Error retrieving slack token", error);
    return null;
  }
  if (!account) {
    return null;
  }

  if (account.expires_at < new Date()) {
    const tokenRes = await refreshSlackToken(account.refresh_token);
    if (tokenRes) {
      await storeSlackToken({ session, response: tokenRes });
      return tokenRes.access_token;
    }
    return null;
  }
  const token: string = account.access_token;

  return token;
};

export const refreshSlackToken = async (token: string) => {
  try {
    if (!clientId || !clientSecret) {
      throw new Error("No slack client id or secret");
    }
    const resp = await slackClient.oauth.v2.access({
      client_id: clientId as string,
      client_secret: clientSecret as string,
      grant_type: "refresh_token",
      refresh_token: token,
    });
    return resp;
  } catch (error: any) {
    slackErrorLogger({ error, route: "refresh oauth.v2.access" });
    return null;
  }
};

export const storeSlackToken = async ({
  session,
  response,
}: {
  session: Session;
  response: OauthV2AccessResponse;
}) => {
  const { authed_user } = response;
  if (!authed_user) {
    return null;
  }
  const { id, scope, access_token, token_type, refresh_token, expires_in } =
    authed_user;
  const expires_at = new Date(Date.now() + expires_in! * 1000 - 60000);

  try {
    const { rows } = await sql({
      query: `
            SELECT id
            FROM users
            WHERE email = $1;`,
      values: [session.user.email],
    });
    const userId = rows[0].id;
    await sql({
      query: `
            INSERT INTO accounts (
                user_id, 
                provider_id, 
                provider_type, 
                provider_account_id, 
                refresh_token, 
                access_token, 
                expires_at, 
                token_type, 
                scope)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (user_id, provider_id, token_type) DO UPDATE 
            SET provider_type = $3,
                provider_account_id = $4,
                refresh_token = $5, 
                access_token = $6, 
                expires_at = $7, 
                scope = $9;
            `,
      values: [
        userId,
        "slack",
        "oauth",
        id,
        refresh_token,
        access_token,
        expires_at,
        token_type,
        scope,
      ],
    });
    return true;
  } catch (error: any) {
    console.log("Error upsert into accounts", error);
    return false;
  }
};

export type SlackError = {
  code: ErrorCode;
  data: {
    ok: boolean;
    error: string;
  };
};

export const slackErrorLogger = ({
  error,
  route,
}: {
  error: SlackError;
  route?: string;
}) => {
  const errorData = JSON.stringify(error.data.error);
  if (error.code === ErrorCode.PlatformError) {
    console.log("Slack platform error", route, errorData);
  }
  if (error.code === ErrorCode.RequestError) {
    console.log("Slack request error", route, errorData);
  }
  if (error.code === ErrorCode.HTTPError) {
    console.log("Slack http error", route, errorData);
  }
  if (error.code === ErrorCode.RateLimitedError) {
    console.log("Slack rate limited error", route, errorData);
  }
  if (error.code === ErrorCode.FileUploadReadFileDataError) {
    console.log("Slack file upload read file data error", route, errorData);
  }
  if (error.code === ErrorCode.FileUploadInvalidArgumentsError) {
    console.log("Slack file upload invalid arguments error", route, errorData);
  }
};
