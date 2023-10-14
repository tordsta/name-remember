import sql from "@/database/pgConnect";
import { Account } from "next-auth";
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

export default function customAuthAdapter(): Adapter {
  try {
    const createUser = async (
      user: Omit<AdapterUser, "id">
    ): Promise<AdapterUser> => {
      const { rows } = await sql({
        query: `
        INSERT INTO users (name, email, image) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, email, email_verified, image`,
        values: [user.name, user.email, user.image],
      });
      const newUser: AdapterUser = {
        ...rows[0],
        id: rows[0].id.toString(),
        email_verified: rows[0].email_verified,
        email: rows[0].email,
      };
      return newUser;
    };

    const getUser = async (id: string) => {
      const { rows } = await sql({
        query: `
          SELECT *
          FROM users
          WHERE id = $1;
        `,
        values: [id],
      });
      return {
        ...rows[0],
        id: rows[0].id.toString(),
        email_verified: rows[0].email_verified,
        email: rows[0].email,
      };
    };

    const getUserByEmail = async (email: string) => {
      const { rows } = await sql({
        query: `SELECT * FROM users WHERE email = $1`,
        values: [email],
      });
      return rows[0]
        ? {
            ...rows[0],
            id: rows[0].id.toString(),
            email_verified: rows[0].email_verified,
            email: rows[0].email,
          }
        : null;
    };

    const getUserByAccount = async ({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }): Promise<AdapterUser | null> => {
      const { rows } = await sql({
        query: `
      SELECT u.* 
      FROM users u join accounts a on u.id = a.user_id 
      WHERE a.provider_id::varchar = $1
      AND a.provider_account_id::varchar = $2`,
        values: [provider, providerAccountId],
      });
      //To expand the session user object add more information here. (and in validatePassword.ts)
      const user = rows[0]
        ? {
            email: rows[0].email,
            image: rows[0].image,
            name: rows[0].name,
            id: rows[0].id.toString(),
            email_verified: rows[0].email_verified,
            subscription_plan: rows[0].subscription_plan,
          }
        : null;
      return user as any;
    };

    const updateUser = async (
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ): Promise<AdapterUser> => {
      const { rows } = await sql({
        query: `
            UPDATE users
            SET name = $1, email = $2, image = $3
            WHERE id = $4
            RETURNING id, name, email, image;
            `,
        values: [user.name, user.email, user.image, user.id],
      });
      const updatedUser: AdapterUser = {
        ...rows[0],
        id: rows[0].id.toString(),
        email_verified: rows[0].email_verified,
        email: rows[0].email,
      };
      return updatedUser;
    };

    const deleteUser = async (userId: string) => {
      await sql({ query: `DELETE FROM users WHERE id = $1`, values: [userId] });
      return;
    };

    const createSession = async ({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> => {
      const expiresString = expires.toDateString();
      await sql({
        query: `
        INSERT INTO auth_sessions (user_id, expires, session_token) 
        VALUES ($1, $2, $3)
      `,
        values: [userId, expiresString, sessionToken],
      });
      const createdSession: AdapterSession = {
        sessionToken,
        userId,
        expires,
      };
      return createdSession;
    };

    const getSessionAndUser = async (
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> => {
      const session = await sql({
        query: `
        SELECT * 
        FROM auth_sessions 
        WHERE session_token = $1`,
        values: [sessionToken],
      });
      if (!session.rows[0]) {
        return null;
      }
      const { rows } = await sql({
        query: `
        SELECT * 
        FROM users 
        WHERE id = $1`,
        values: [session.rows[0].user_id],
      });
      const expiresDate = new Date(session.rows[0].expires);
      const sessionAndUser: { session: AdapterSession; user: any } = {
        session: {
          sessionToken: session.rows[0].session_token,
          userId: session.rows[0].user_id,
          expires: expiresDate,
        },
        user: {
          id: rows[0].id,
          email_verified: rows[0].email_verified,
          email: rows[0].email,
          name: rows[0].name,
          image: rows[0].image,
        },
      };

      return sessionAndUser;
    };

    const updateSession = async (
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
      token?: string
    ): Promise<AdapterSession | null | undefined> => {
      if (
        !session.expires ||
        typeof session.expires == "undefined" ||
        !session.sessionToken
      ) {
        throw new Error(
          "updateSession: The session object must have an expires property and sessionToken to be updated."
        );
      }
      const expiresString = session.expires.toDateString();
      await sql({
        query: `
          UPDATE auth_sessions
          SET expires = $1
          WHERE session_token = $2
      `,
        values: [expiresString, session.sessionToken],
      });
      return;
    };

    const deleteSession = async (sessionToken: string) => {
      await sql({
        query: `
          DELETE FROM auth_sessions
          WHERE session_token = $1;
        `,
        values: [sessionToken],
      });
      return;
    };

    const linkAccount = async (
      account: AdapterAccount
    ): Promise<AdapterAccount | null | undefined> => {
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
            scope,
            id_token
        ) 
        VALUES (
           $1, $2, $3, $4, $5, $6, to_timestamp($7) , $8, $9, $10
        )`,
        values: [
          account.userId,
          account.provider,
          account.type,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
        ],
      });
      return account;
    };

    const unlinkAccount = async ({
      providerAccountId,
      provider,
    }: {
      providerAccountId: Account["providerAccountId"];
      provider: Account["provider"];
    }) => {
      await sql({
        query: `
            DELETE FROM accounts 
            WHERE provider_account_id = $1 AND provider_id = $2`,
        values: [providerAccountId, provider],
      });
      return;
    };

    const createVerificationToken = async ({
      identifier,
      expires,
      token,
    }: VerificationToken): Promise<VerificationToken | null | undefined> => {
      const { rows } = await sql({
        query: `
        INSERT INTO verification_tokens (identifier, token, expires) 
        VALUES ($1, $2, $3)`,
        values: [identifier, token, expires.toString()],
      });
      const createdToken: VerificationToken = {
        identifier: rows[0].identifier,
        token: rows[0].token,
        expires: rows[0].expires,
      };
      return createdToken;
    };

    //Return verification token from the database and delete it so it cannot be used again.
    const useVerificationToken = async ({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }) => {
      const { rows } = await sql({
        query: `
        SELECT * FROM verification_tokens 
        WHERE email = $1
        AND token = $2 AND expires > NOW()`,
        values: [identifier, token],
      });
      await sql({
        query: `
        DELETE FROM verification_tokens
        WHERE email = $1
        AND token = $2`,
        values: [identifier, token],
      });
      return {
        expires: rows[0].expires,
        identifier: rows[0].email,
        token: rows[0].token,
      };
    };

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

// interface DatabaseUser extends User {
//   id: string;
//   name: string;
//   email: string;
//   email_verified: string;
//   image: string;
// }

// interface DatabaseAccount extends Account {
//   id: string;
//   user_id: string;
//   provider_id: string;
//   provider_type: string;
//   provider_account_id: string;
//   refresh_token: string;
//   access_token: string;
//   expires_at: number;
//   token_type: string;
//   scope: string;
//   id_token: string;
//   session_state: string;
// }

// interface DatabaseVerificationToken extends VerificationToken {
//   identifier: string;
//   token: string;
//   expires: Date;
// }

// interface DatabaseAuthSession extends Session {
//   id: string;
//   expires: string;
//   session_token: string;
//   user_id: string;
// }
