import { signIn } from "next-auth/react";
import { FramedButton } from "../Button";
import Link from "next/link";

export default function SignInProviders({
  providers,
  csrfToken,
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
  csrfToken: string;
}) {
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
            <form
              method="post"
              key={provider.name}
              action="/api/auth/callback/credentials"
              className="flex flex-col gap-4 justify-center items-center"
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
              <FramedButton typeSubmit={true}>Log in</FramedButton>
            </form>
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
