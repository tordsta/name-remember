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
  fname?: string;
  mname?: string;
  lname?: string;
  image?: string;
};
