import { signIn } from "next-auth/react";
import { FramedButton } from "../Button";
import Link from "next/link";
import { sign } from "crypto";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

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
  const router = useRouter();
  // const handleCredentialsSignIn = async (e: any) => {
  //   const res = await signIn("credentials", {
  //     csrfToken: e.target.csrfToken.value,
  //     email: e.target.email.value,
  //     password: e.target.password.value,
  //     redirect: false,
  //   });
  //   if (res?.status == 200) {
  //     console.log("success");
  //     router.push("/dashboard");
  //   } else if (res?.error === "custom error to the client") {
  //     console.log("custom error");
  //     // handle this particular error
  //   } else {
  //     console.log("generic error");
  //     // handle generic error
  //   }
  // };

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
              action="/api/auth/callback/credentials"
              key={provider.name}
              //onSubmit={handleCredentialsSignIn}
              className="flex flex-col gap-4 justify-center items-center"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
