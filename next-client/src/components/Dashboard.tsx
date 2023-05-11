import Button from "@/components/style/Button";
import Lists from "@/components/Lists";
import UserEmblem from "@/components/UserEmblem";
import React from "react";
import {
  notify,
  notifyError,
  notifyInfo,
  notifyPromiseFetch,
  notifySuccess,
  notifyWarning,
} from "./Notify";

export default function Home() {
  const [res, setRes] = React.useState();
  return (
    <>
      <div className="flex w-full justify-between border-b border-white">
        <h1 className="text-2xl sm:text-4xl font-bold mx-8 my-6">
          Name Remember
        </h1>
        <UserEmblem />
      </div>
      <div className="flex flex-col md:flex-row flex-grow justify-start md:justify-between items-center my-8 md:my-20 mx-2">
        <div className="flex flex-col text-center justify-center items-center">
          <Button onClick={() => console.log("clicked start memorization")}>
            <p>Start Memorization</p>
          </Button>
          <div className="mt-8">
            <p>Everyone</p> {/*current list name*/}
            <ul>
              <li>Per</li>
              <li>Knut</li>
              <li>Paal</li>
            </ul>
            <Button onClick={() => {}}>Add Person</Button>
          </div>
        </div>
        <Lists />
      </div>
      <button
        onClick={async () => {
          //   notify("it worked");
          //   notifyInfo("it worked");
          //   notifyWarning("it worked");
          //   notifySuccess("it worked");
          //   notifyError("it worked");
          const resp = await notifyPromiseFetch({
            url: "/api/crud/createList",
            pending: "Promise is pending",
            success: "Promise resolved 👌",
            error: "Promise rejected 🤯",
          });
          console.log("resp", resp);
        }}
      >
        Click me
      </button>
    </>
  );
}

const resolveAfter3Sec = new Promise((resolve) => setTimeout(resolve, 3000));
const fetchSomething = new Promise((resolve, reject) => {
  fetch("/api/crud/createList").then((res) => {
    if (res.ok) {
      console.log("resolve", res);
      resolve(res);
    } else {
      console.log("reject", res);
      reject(res);
    }
  });
});
