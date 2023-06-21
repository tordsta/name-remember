import { useState } from "react";
import Modal from "react-modal";
import { Lists } from "@/utils/types";
import Button, { FramedButton } from "./Button";
import DefaultModal from "./Modal";
import useCreateList from "@/hooks/useCreateList";
import Image from "next/image";
import { useRouter } from "next/router";
import { trackAmplitudeData } from "@/utils/amplitude";

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
          <Button style="small" onClick={() => setOpenSignal(true)}>
            Create new group
          </Button>
        </div>
      </div>
      <ul className="mb-4 w-full">
        {isLoading && <li>Loading... </li>}
        {!isLoading && !isError && data && Array.isArray(data) && (
          <>
            {data.map((list) => {
              return (
                <li
                  key={list.id}
                  className="flex flex-col w-full p-2 mt-4 h-28 md:h-32 bg-white border border-black"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-3xl ml-2 pt-2 pl-2">{list.name}</p>
                    <button
                      className="w-7 h-7 md:w-10 md:h-10 relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/edit/${list.id}`);
                      }}
                    >
                      <Image
                        src="/icons/settingsFramed110x110.png"
                        alt="edit icon"
                        fill
                        sizes="100%"
                      />
                    </button>
                  </div>
                  {/* TODO number of people in list */}
                  {/* TODO reminder setting of list */}
                  <div className="flex h-full justify-end items-end text-xl pb-1">
                    <FramedButton
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/memorize/${list.id}`);
                      }}
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

Modal.setAppElement("#__next");
