import { FramedButton } from "@/components/Button";
import { notify, notifyPromiseFetch, notifyWarning } from "@/components/Notify";
import Layout from "@/components/navigation/Layout";
import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";

export default function EmailSignUp({ csrfToken }: { csrfToken: string }) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = (event.target as any)["email"].value;
    const password = (event.target as any)["password"].value;
    const verifyPassword = (event.target as any)["verify_password"].value;

    if (password != verifyPassword) {
      notifyWarning("Passwords do not match");
      return;
    }

    const res = await notifyPromiseFetch({
      url: "/api/auth/signup",
      body: JSON.stringify({
        email,
        password,
      }),
      pending: "Creating account...",
      success: "Account created",
      error: "Account creation failed",
    });
    console.log(res);
  };

  return (
    <Layout nav={false} auth={false}>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col m-auto gap-4 justify-center items-end"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="email"
            type="text"
          />
        </label>
        <label>
          Password
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="password"
            type="password"
          />
        </label>
        <label>
          Verify password
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="verify_password"
            type="password"
          />
        </label>
        <div className="mx-auto">
          <FramedButton typeSubmit={true}>Create new account</FramedButton>
        </div>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
