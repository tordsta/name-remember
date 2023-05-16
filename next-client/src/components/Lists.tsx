import { useState } from "react";
import Modal from "react-modal";
import { Lists } from "@/utils/types";
import Button from "./style/Button";
import { usePeopleLists } from "@/hooks/usePeopleLists";
import DefaultModal from "./Modal";
import { notifyPromiseFetch } from "./Notify";
import { useQuery, useQueryClient } from "react-query";

export default function Lists() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = usePeopleLists();

  const [openSignal, setOpenSignal] = useState(false);

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault();
    setOpenSignal(false);

    const name = (event.target as any)["listName"].value;
    await notifyPromiseFetch({
      url: "/api/crud/createList?name=" + name,
      pending: "... processing",
      success: `List ${name} created!`,
      error: "Error: Could not create list.",
    });
    queryClient.invalidateQueries({ queryKey: ["peopleLists"] });
  };

  const handleDeleteList = async (id: string) => {
    await notifyPromiseFetch({
      url: "/api/crud/deleteList?id=" + id,
      pending: "... processing",
      success: `List deleted!`,
      error: "Error: Could not delete list.",
    });
    queryClient.invalidateQueries({ queryKey: ["peopleLists"] });
  };

  return (
    <div className="mt-8 mx-2">
      <p className="text-lg font-bold">My lists</p>
      <ul className="mb-2">
        {isLoading && <li>Loading... </li>}
        {!isLoading && !error && data && Array.isArray(data) && (
          <>
            {data.map((list) => {
              return (
                <li key={list.id} className="flex">
                  <div className="flex flex-col">
                    <p className="font-bold">{list.name}</p>
                    <p>People: 6</p>
                  </div>
                  <Button
                    style="small"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    Delete
                  </Button>
                </li>
              );
            })}
          </>
        )}
      </ul>
      <Button style="small" onClick={() => setOpenSignal(true)}>
        Create new list
      </Button>
      <DefaultModal openSignal={openSignal}>
        <div className="flex flex-col items-center justify-center mx-4 my-2">
          <div className="flex w-full items-center justify-end mb-4"></div>
          <p className="text-xl mb-4">Create new list</p>
          <form
            onSubmit={handleCreateList}
            className="flex flex-col items-center justify-center gap-4"
          >
            <label className="flex  flex-col items-center justify-center gap-1">
              List name
              <input
                name="listName"
                type="text"
                className="border border-black rounded mx-2"
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
