import { useEffect, useState } from "react";
import StyledButton, { SmallButton } from "./style/buttons";
import Modal from "react-modal";
import { Lists } from "@/utils/types";

export default function Lists() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [apiFeedback, setApiFeedback] = useState("");
  const [lists, setLists] = useState<Array<Lists>>();

  useEffect(() => {
    fetch("/api/crud/getLists").then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setLists(JSON.parse(data));
        });
      }
    });
  }, [apiFeedback]);

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

  function openModal() {
    setApiFeedback("");
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setApiFeedback("");
  }
  console.log("Lists", typeof lists, lists);

  return (
    <div className="mt-8 mx-2">
      <p className="text-lg font-bold">My lists</p>
      <ul className="mb-2">
        {Array.isArray(lists) &&
          lists.map((list) => {
            return <li key={list.id}>{list.data.name}</li>;
          })}
      </ul>
      <SmallButton onClick={openModal}>Create new list</SmallButton>
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
            <SmallButton onClick={closeModal}>
              <p className="text-sm">Close</p>
            </SmallButton>
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
