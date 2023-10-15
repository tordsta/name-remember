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
  list_id?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image?: string;
  created_at?: string;
  updated_at?: string;
  subscription_plan: "free" | "basic" | "standard" | "premium" | "professional";
  stripe_customer_id?: string;
  hashed_password?: string;
  salt?: string;
};

export type Session = {
  expires: string;
  user: User;
};
