import { signIn } from "next-auth/react";
import { FramedButton } from "../Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { notifyError, notifyPromiseFetch } from "../Notify";
import Modal from "../Modal";

export default function SignInProviders({
  providers,
}: {
  providers: {
    [key: string]: {
      id: string;
      name: string;
      type: string;
      signinUrl: string;
      callbackUrl: string;
    };
  };
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [openSignal, setOpenSignal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleCredentialsSignIn = async () => {
    if (!email || !password)
      return notifyError("Please enter an email and password");
    const res = await signIn("credentials", {
      redirect: false,
      email: email.trim(),
      password: password,
    });

    if (res?.error) {
      notifyError(res.error);
      if (res.error === "Email not verified.") {
        router.push(`/verify-email?email=${email}`);
      }
    } else if (!res?.error && res?.status === 200) {
      router.push("/dashboard");
    }
  };

  if (providers === undefined) return <></>;

  return (
    <div className="flex flex-col justify-center items-center gap-4 lg:flex-row lg:gap-20">
      <div className="flex flex-col">
        <p className="text-xl my-2 text-center">Select a sign in provider</p>
        {Object.values(providers)
          .filter((provider) => provider.type != "credentials")
          .map((provider) => (
            <div key={provider.name} className="mx-auto my-2">
              <FramedButton onClick={() => signIn(provider.id)}>
                {provider.name}
              </FramedButton>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <p className="text-xl text-center">or sign in with email</p>
        {Object.values(providers)
          .filter((provider) => provider.type == "credentials")
          .map((provider) => (
            <div
              key={provider.name}
              className="flex flex-col gap-4 justify-center items-center"
            >
              <label>
                Email
                <input
                  className="border border-black mx-2 px-1 pt-1"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Password
                <input
                  className="border border-black mx-2 px-1 pt-1"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <FramedButton onClick={handleCredentialsSignIn}>
                Log in
              </FramedButton>
            </div>
          ))}
        <p className="text-sm w-60 text-center">
          Want to use email, but don&apos;t have an account?{" "}
          <Link href={"/email-sign-up"} className=" underline">
            Sign up here.
          </Link>
        </p>
        <p
          onClick={() => {
            setForgotPasswordEmail(email);
            setOpenSignal(true);
          }}
          className="text-sm underline"
        >
          Forgot password?
        </p>
        <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
          <div className="flex flex-col justify-center items-center gap-4">
            Forgot password?
            <input
              placeholder="Email"
              defaultValue={email}
              className="border border-black text-center mx-2 px-1 pt-1 w-52"
              onChange={(e) => {
                setForgotPasswordEmail(e.target.value);
              }}
              type="text"
            />
            <FramedButton
              onClick={() => {
                notifyPromiseFetch({
                  url: "/api/auth/reset-password",
                  body: JSON.stringify({ email: forgotPasswordEmail }),
                  pending: "Processing...",
                  success: "Email sent.",
                  error: "An error occurred.",
                });
                setOpenSignal(false);
              }}
            >
              Reset password
            </FramedButton>
          </div>
        </Modal>
      </div>
    </div>
  );
}
