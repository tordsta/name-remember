import { useState } from "react";
import { Lists } from "@/utils/types";
import Button, { FramedButton } from "../Button";
import DefaultModal from "../Modal";
import useCreateList from "@/lib/reactQuery/clientHooks/useCreateList";
import Image from "next/image";
import { useRouter } from "next/router";
import { trackAmplitudeData } from "@/lib/amplitude";
import { RRule } from "rrule";
import { notifyInfo } from "../Notify";
import { useUser } from "@/lib/reactQuery/clientHooks/useUser";

export default function Lists({
  data,
  isLoading,
  isError,
}: {
  data: any;
  isLoading: boolean;
  isError: boolean;
}) {
  const [openSignal, setOpenSignal] = useState(false);
  const createList = useCreateList();
  const router = useRouter();
  const user = useUser();

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault();
    setOpenSignal(false);

    const name = (event.target as any)["listName"].value;
    createList.mutate(name);
    trackAmplitudeData("Created List", { name });
  };

  return (
    <div className="flex flex-col mt-6 md:mt-16 mb-4 px-10 w-full justify-center items-start max-w-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between mx-auto w-full md:mx-0">
        <p className="text-3xl mx-auto md:mx-0">Groups to remember</p>
        <div className="mx-auto mt-3 mb-1 md:m-0">
          <Button
            style="small"
            onClick={() => {
              if (data.length < 3 || user?.subscription_plan === "premium") {
                setOpenSignal(true);
              } else {
                notifyInfo("Upgrade to premium to create more groups");
              }
            }}
          >
            Create new group
          </Button>
        </div>
      </div>
      <ul className="w-full">
        {isLoading && <li>Loading... </li>}
        {!isLoading && !isError && data && Array.isArray(data) && (
          <>
            number of lists: {data.length}{" "}
            {data.map((list) => {
              let rule: RRule | null = null;
              let ruleText = "";
              if (list.rrule) {
                let ruleOption = RRule.parseString(list.rrule);
                rule = new RRule(ruleOption);
                ruleText = rule.toText();
              }
              return (
                <li
                  key={list.id}
                  className="flex flex-col w-full my-6 p-2 h-32 bg-white border border-black"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-3xl pl-2 md:pl-4">{list.name}</p>
                    <div
                      className="flex justify-center items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/edit/${list.id}`);
                      }}
                    >
                      <div className="flex flex-col">
                        <p className="pt-1 text-lg leading-none">Edit</p>
                        <p className="pt-1 text-lg leading-none">here</p>
                      </div>
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/icons/settingsFramed110x110.png"
                          alt="edit icon"
                          fill
                          sizes="100%"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full justify-between items-end text-xl pb-1">
                    <div className="ml-2 text-md">
                      <p>Members: {list.people_in_lists_count}</p>
                      {list.rrule && (
                        <p className="hidden md:block">Reminder: {ruleText}</p>
                      )}
                    </div>
                    <FramedButton
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/memorize/${list.id}`);
                      }}
                      width={150}
                      height={40}
                    >
                      Memorize
                    </FramedButton>
                  </div>
                </li>
              );
            })}
          </>
        )}
      </ul>
      <DefaultModal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col items-center justify-center mx-4 my-2">
          <div className="flex w-full items-center justify-end mb-4"></div>
          <p className="text-xl mb-4">Create new group</p>
          <form
            onSubmit={handleCreateList}
            className="flex flex-col items-center justify-center gap-4"
          >
            <label className="flex flex-col items-center justify-center gap-1">
              Name of group
              <input
                name="listName"
                type="text"
                className="border border-black rounded mx-2 px-1"
              />
            </label>
            <div className="flex gap-2">
              <Button style={"cancel"} onClick={() => setOpenSignal(false)} />
              <Button style="submit" typeSubmit={true} />
            </div>
          </form>
        </div>
      </DefaultModal>
    </div>
  );
}
