import type { WebClient } from "@slack/web-api";
import {
  base64AbrahamLincoln,
  base64AlbertEinstein,
  base64CharlieChaplin,
  base64JohnLennon,
  base64MarilynMonroe,
} from "@/utils/exampleImagesBase64";

// A "Demo Workspace" with two channels, served in place of the Slack Web API.
// Implements only the calls this app makes (see src/lib/slack.ts and
// pages/api/slack). Member photos reuse the bundled example images.

const log = (...args: unknown[]) => console.log("[mock:slack]", ...args);

const TEAM = { id: "T_MOCK_DEMO", name: "Demo Workspace" };

const USERS: Record<
  string,
  { first_name: string; last_name: string; image_512: string }
> = {
  U_MOCK_MM: {
    first_name: "Marilyn",
    last_name: "Monroe",
    image_512: base64MarilynMonroe,
  },
  U_MOCK_CC: {
    first_name: "Charlie",
    last_name: "Chaplin",
    image_512: base64CharlieChaplin,
  },
  U_MOCK_JL: {
    first_name: "John",
    last_name: "Lennon",
    image_512: base64JohnLennon,
  },
  U_MOCK_AE: {
    first_name: "Albert",
    last_name: "Einstein",
    image_512: base64AlbertEinstein,
  },
  U_MOCK_AL: {
    first_name: "Abraham",
    last_name: "Lincoln",
    image_512: base64AbrahamLincoln,
  },
};

const CHANNELS = [
  {
    id: "C_MOCK_CREATIVE",
    name: "creative-team",
    members: ["U_MOCK_MM", "U_MOCK_CC", "U_MOCK_JL"],
  },
  {
    id: "C_MOCK_RESEARCH",
    name: "research",
    members: ["U_MOCK_AE", "U_MOCK_AL"],
  },
];

const TEN_YEARS_IN_SECONDS = 10 * 365 * 24 * 60 * 60;

const mockSlackClient = {
  oauth: {
    v2: {
      async access() {
        log("oauth.v2.access: connected", TEAM.name);
        return {
          ok: true,
          team: TEAM,
          enterprise: null,
          is_enterprise_install: false,
          authed_user: {
            id: "U_MOCK_ME",
            scope: "channels:read,groups:read,users.profile:read",
            access_token: "xoxp-mock",
            token_type: "user",
            refresh_token: "xoxe-mock",
            // Long-lived so the refresh path is never needed
            expires_in: TEN_YEARS_IN_SECONDS,
          },
        };
      },
    },
  },
  users: {
    async conversations() {
      log("users.conversations");
      return {
        ok: true,
        channels: CHANNELS.map(({ id, name }) => ({ id, name })),
      };
    },
    profile: {
      async get({ user }: { user: string }) {
        const profile = USERS[user];
        if (!profile) return { ok: false };
        return {
          ok: true,
          profile: {
            ...profile,
            real_name: `${profile.first_name} ${profile.last_name}`,
          },
        };
      },
    },
  },
  conversations: {
    async members({ channel }: { channel: string }) {
      log("conversations.members", channel);
      const found = CHANNELS.find((c) => c.id === channel);
      return { ok: Boolean(found), members: found?.members ?? [] };
    },
  },
} as unknown as WebClient;

export default mockSlackClient;
