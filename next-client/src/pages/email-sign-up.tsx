import { FramedButton } from "@/components/Button";
import {
  notifyError,
  notifyPromiseFetch,
  notifyWarning,
} from "@/components/Notify";
import Layout from "@/components/navigation/Layout";
import { useRouter } from "next/router";

export default function EmailSignUp() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = (event.target as any)["name"].value.trim();
    const email = (event.target as any)["email"].value.trim();
    const password = (event.target as any)["password"].value.trim();
    const verifyPassword = (event.target as any)[
      "verify_password"
    ].value.trim();

    if (
      String(email)
        .toLowerCase()
        .trim()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) == null
    ) {
      notifyWarning("Invalid email address");
      return;
    }
    if (password != verifyPassword) {
      notifyWarning("Passwords do not match");
      return;
    }

    try {
      const res = await notifyPromiseFetch({
        url: "/api/auth/sign-up",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
        pending: "Creating account...",
        success: "Account created",
        error: "Account creation failed",
      });
      if (res.ok) {
        router.push(`/verify-email?email=${email}`);
      }
    } catch (e) {
      const res = e as Response;
      const errorMessage = await res.json();
      notifyError(errorMessage);
    }
  };

  return (
    <Layout nav={false} auth={false}>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col m-auto gap-4 justify-center items-end"
      >
        <label>
          Full name
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="name"
            type="text"
            required
          />
        </label>
        <label>
          Email
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="email"
            type="text"
            required
          />
        </label>
        <label>
          Password
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="password"
            type="password"
            required
          />
        </label>
        <label>
          Verify password
          <input
            className="border border-black mx-2 px-1 pt-1"
            name="verify_password"
            type="password"
            required
          />
        </label>
        <div className="mx-auto">
          <FramedButton typeSubmit={true}>Create new account</FramedButton>
        </div>
      </form>
    </Layout>
  );
}
