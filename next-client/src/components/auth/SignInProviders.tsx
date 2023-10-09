import { signIn } from "next-auth/react";
import { FramedButton } from "../Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { notifyError } from "../Notify";

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

  const handleCredentialsSignIn = async () => {
    console.log("password", password);
    console.log("email", email);
    if (!email || !password)
      return notifyError("Please enter an email and password");
    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.error) {
      console.log("res.error", res.error);
      notifyError(res.error);
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
          <Link href={"/emailsignup"} className=" underline">
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
}
