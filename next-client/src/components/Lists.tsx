import { useState } from "react";
import Modal from "react-modal";
import { Lists } from "@/utils/types";
import Button from "./style/Button";
import { usePeopleLists } from "@/hooks/usePeopleLists";

export default function Lists() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [apiFeedback, setApiFeedback] = useState("");
  const { data, isLoading, isFetching } = usePeopleLists();

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = (event.target as any)["listName"].value;
    console.log("create list, name:" + name);
    const res = await fetch(`/api/crud/createList?name=${name}`);
    if (res.ok) {
      setApiFeedback("List created");
      setTimeout(() => {
        closeModal();
      }, 1500);
    } else {
      setApiFeedback(JSON.stringify(res.body));
    }
  };

  const handleDeleteList = async (name: string) => {
    const res = await fetch(`/api/crud/deleteList?name=${name}`);
  };

  function openModal() {
    setApiFeedback("");
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setApiFeedback("");
  }

  return (
    <div className="mt-8 mx-2">
      <p className="text-lg font-bold">My lists</p>
      <ul className="mb-2">
        <li>{data && data.length}</li>
        {/* {Array.isArray(data) &&
          data.map((list) => {
            return (
              <li key={list.id} className="flex">
                <div className="flex flex-col">
                  <p className="font-bold">{list.data.name}</p>
                  <p>People: {list.data.people.length}</p>
                </div>
                <Button
                  style="small"
                  onClick={() => handleDeleteList(list.data.name)}
                >
                  Delete
                </Button>
              </li>
            );
          })} */}
      </ul>
      <Button style="small" onClick={openModal}>
        Create new list
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="flex flex-col items-center justify-center mx-4 my-2">
          <div className="flex w-full items-center justify-end mb-4">
            <Button style={"small"} onClick={closeModal}>
              <p className="text-sm">Close</p>
            </Button>
          </div>
          <p className="text-xl mb-4">Create new list</p>
          <form
            onSubmit={handleCreateList}
            className="flex flex-col items-center justify-center gap-4"
          >
            <label className="flex flex-col items-center justify-center gap-1">
              List name
              <input
                name="listName"
                type="text"
                className="border border-black dark:border-white rounded mx-2"
              />
            </label>
            <p>{apiFeedback}</p>
            <button
              type="submit"
              className="border border-black dark:border-white rounded-md px-2 py-1 h-min"
            >
              <p className="font-bold">Create List</p>
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

Modal.setAppElement("#__next");
