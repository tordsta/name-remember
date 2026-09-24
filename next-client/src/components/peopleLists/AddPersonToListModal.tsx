import { useState } from "react";
import DefaultModal from "../Modal";
import Button, { FramedButton } from "../Button";
import AddPerson from "./AddPerson";

export default function AddPersonToListModal({ listId }: { listId: string }) {
  const [openSignal, setOpenSignal] = useState(false);

  return (
    <>
      <FramedButton onClick={() => setOpenSignal(true)}>
        Manual Upload
      </FramedButton>
      <DefaultModal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        {/* Mobile view can only add one person at the time */}
        <div className="block md:hidden">
          <AddPerson listId={listId} setOpenSignal={setOpenSignal} />
        </div>
        <div className="hidden md:flex flex-col justify-center items-center">
          <p className="text-xl m-2">Add Members</p>
          <div className="flex flex-row justify-around w-full">
            <p>First Name</p>
            <p>Middle Name</p>
            <p>Last Name</p>
            <p>Select Image</p>
            <p></p>
          </div>
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <AddPerson listId={listId} />
          <div className="flex flex-col justify-center items-center gap-2 mt-4">
            <p>Submit all individuals before exiting</p>
            <Button onClick={() => setOpenSignal(false)}>Exit</Button>
          </div>
        </div>
      </DefaultModal>
    </>
  );
}
