import { sql } from "@vercel/postgres";
import { User, Account, Session } from "next-auth";

type DatabaseUser = {
  id: string;
  name: string;
  email: string;
  email_verified: string;
  image: string;
};

type DatabaseAccount = {
  id: string;
  user_id: string;
  provider_id: string;
  provider_type: string;
  provider_account_id: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  session_state: string;
};

type DatabaseVerificationToken = {
  identifier: string;
  token: string;
  expires: string;
};

type DatabaseAuthSession = {
  id: string;
  expires: string;
  session_token: string;
  user_id: string;
};

export default function vercelPostgresAdapter() {
  try {
    const createUser = async (user: User) => {
      const { rows } = await sql`
        INSERT INTO users (name, email, image) 
        VALUES (${user.name}, ${user.email}, ${user.image}) 
        RETURNING id, name, email, email_verified, image`;
      return rows[0];
    };

    const getUser = async (id: DatabaseUser["id"]) => {
      const { rows } = await sql`
          SELECT *
          FROM users
          WHERE id = ${id};
        `;
      return rows[0];
    };

    const getUserByEmail = async (email: DatabaseUser["email"]) => {
      const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
      return rows[0];
    };

    const getUserByAccount = async ({
      provider,
      providerAccountId,
    }: {
      provider: DatabaseAccount["provider_id"];
      providerAccountId: DatabaseAccount["provider_account_id"];
    }) => {
      const { rows } = await sql`
      SELECT u.* 
      FROM users u join accounts a on u.id = a.user_id 
      WHERE a.provider_id = ${provider} 
      AND a.provider_account_id = ${providerAccountId}`;
      return {
        email: rows[0].email,
        emailVerified: rows[0].email_verified,
        id: rows[0].id,
      };
    };

    const updateUser = async (user: DatabaseUser) => {
      const { rows } = await sql`
            UPDATE users
            SET name = ${user.name}, email = ${user.email}, image = ${user.image}
            WHERE id = ${user.id}
            RETURNING id, name, email, image;
            `;
      return rows[0];
    };

    const deleteUser = async (userId: DatabaseUser["id"]) => {
      await sql`DELETE FROM users WHERE id = ${userId}`;
      return;
    };

    const createSession = async ({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: DatabaseAuthSession["session_token"];
      userId: DatabaseUser["id"];
      expires: DatabaseAuthSession["expires"];
    }) => {
      await sql`
        INSERT INTO auth_sessions (user_id, expires, session_token) 
        VALUES (${userId}, ${expires}, ${sessionToken})
      `;
      return {
        sessionToken,
        userId,
        expires,
      };
    };

    const getSessionAndUser = async (
      sessionToken: DatabaseAuthSession["session_token"]
    ) => {
      const session = await sql`
        SELECT * 
        FROM auth_sessions 
        WHERE session_token = ${sessionToken}`;
      const { rows } = await sql`
        SELECT * 
        FROM users 
        WHERE id = ${session.rows[0].user_id}`;
      return { session: session.rows[0], user: rows[0] };
    };

    const updateSession = async (session: Session) => {
      console.log(
        "Unimplemented function! updateSession in vercelPostgresAdapter. Session:",
        JSON.stringify(session)
      );
      return;
    };

    const deleteSession = async (
      sessionToken: DatabaseAuthSession["session_token"]
    ) => {
      await sql`
          DELETE FROM auth_sessions
          WHERE session_token = ${sessionToken};
        `;
      return;
    };

    const linkAccount = async (account: Account) => {
      await sql`
        INSERT INTO accounts (
            user_id, 
            provider_id, 
            provider_type, 
            provider_account_id, 
            refresh_token,
            access_token,
            expires_at,
            token_type,
            scope,
            id_token
        ) 
        VALUES (
            ${account.userId}, 
            ${account.provider},
            ${account.type}, 
            ${account.providerAccountId}, 
            ${account.refresh_token},
            ${account.access_token}, 
            to_timestamp(${account.expires_at}),
            ${account.token_type},
            ${account.scope},
            ${account.id_token}
        )`;
      return account;
    };

    const unlinkAccount = async ({
      providerAccountId,
      provider,
    }: {
      providerAccountId: Account["providerAccountId"];
      provider: Account["provider"];
    }) => {
      await sql`
            DELETE FROM accounts 
            WHERE provider_account_id = ${providerAccountId} AND provider_id = ${provider}}`;
      return;
    };

    const createVerificationToken = async ({
      identifier,
      expires,
      token,
    }: DatabaseVerificationToken) => {
      const { rows } = await sql`
        INSERT INTO verification_tokens (identifier, token, expires) 
        VALUES (${identifier}, ${token}, ${expires})`;
      return rows[0];
    };

    //Return verification token from the database and delete it so it cannot be used again.
    const useVerificationToken = async ({
      identifier,
      token,
    }: {
      identifier: DatabaseVerificationToken["identifier"];
      token: DatabaseVerificationToken["token"];
    }) => {
      const { rows } = await sql`
        SELECT * FROM verification_tokens 
        WHERE identifier = ${identifier} 
        AND token = ${token} AND expires > NOW()`;
      await sql`
        DELETE FROM verification_tokens
        WHERE identifier = ${identifier}
        AND token = ${token}`;
      return {
        expires: rows[0].expires,
        identifier: rows[0].identifier,
        token: rows[0].token,
      };
    };

    // Return the adapter object
    return {
      createUser,
      getUser,
      updateUser,
      getUserByEmail,
      getUserByAccount,
      deleteUser,
      getSessionAndUser,
      createSession,
      updateSession,
      deleteSession,
      createVerificationToken,
      useVerificationToken,
      linkAccount,
      unlinkAccount,
    };
  } catch (error) {
    throw error;
  }
}
