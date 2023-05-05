import { useState } from "react";
import StyledButton, { SmallButton } from "./style/buttons";
import Modal from "react-modal";

export default function Lists() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [apiFeedback, setApiFeedback] = useState("");

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
    console.log(res);
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
    <div className="mt-8">
      <p>My lists</p>
      <ul>
        <li>Everyone</li>
        <li>New job</li>
        <li>Family reunion 2018</li>
      </ul>
      <StyledButton onClick={openModal}>Create new list</StyledButton>
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
