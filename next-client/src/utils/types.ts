export type NextAuthSession = {
  user: { name: string; email: string; image: string };
  expires: string;
};

export type Lists = {
  id: string;
  data: {
    createdAt: string;
    updatedAt: string;
    owner: string;
    name: string;
    people: Array<string>;
    reminder_trigger_time: string | null;
    trigger_frequency: string | null;
  };
};

export type Person = {
  id?: string;
  fname?: string | null;
  mname?: string | null;
  lname?: string | null;
  image?: string | null;
  image_url?: string | null;
  list_id?: string;
};

//Defines the session object returned by next auth
export type SessionUser = {
  id: string;
  email: string;
  email_verified: boolean;
};

//Defines readUser.ts or the useUser hook
export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  subscription_plan: "free" | "basic" | "standard" | "premium" | "professional";
  stripe_customer_id?: string;
};

export type Session = {
  expires: string;
  user: SessionUser;
};
