import { Inter } from "next/font/google";
import LoginButton from "@/components/loginButton";
import { useSession } from "next-auth/react";
import UserEmblem from "@/components/userEmblem";
import FrontPage from "@/components/frontpage";
import StyledButton from "@/components/style/buttons";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();

  const handleCreateList = async () => {
    console.log("create list");
    const res = await fetch("/api/crud");
    console.log(res);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      {status === "unauthenticated" && <FrontPage />}
      {status === "authenticated" && (
        <>
          <div className="flex w-full justify-between border-b border-white">
            <h1 className="text-2xl sm:text-4xl font-bold mx-8 my-6">
              Name Remember
            </h1>
            <UserEmblem />
          </div>
          <div className="flex flex-col md:flex-row flex-grow justify-start md:justify-between items-center my-8 md:my-20 mx-2">
            <div className="flex flex-col text-center justify-center items-center">
              <StyledButton
                onClick={() => console.log("clicked start memorization")}
              >
                <p>Start Memorization</p>
              </StyledButton>
              <div className="mt-8">
                <p>Everyone</p> {/*current list name*/}
                <ul>
                  <li>Per</li>
                  <li>Knut</li>
                  <li>Paal</li>
                </ul>
                <StyledButton onClick={() => {}}>Add Person</StyledButton>
              </div>
            </div>
            <div className="mt-8">
              <p>My lists</p>
              <ul>
                <li>Everyone</li>
                <li>New job</li>
                <li>Family reunion 2018</li>
              </ul>
              <StyledButton onClick={handleCreateList}>
                Create new list
              </StyledButton>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
