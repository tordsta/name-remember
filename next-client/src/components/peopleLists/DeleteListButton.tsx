import { trackAmplitudeData } from "@/lib/amplitude";
import { FramedButton } from "../Button";
import useDeleteList from "@/lib/reactQuery/clientHooks/useDeletePeopleList";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "../Modal";

export default function DeleteListButton({ listId }: { listId: string }) {
  const router = useRouter();
  const deleteList = useDeleteList();
  const [openSignal, setOpenSignal] = useState(false);

  return (
    <>
      <FramedButton onClick={() => setOpenSignal(true)}>
        <p className=" text-red-500">Delete group</p>
      </FramedButton>
      <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col justify-center items-center m-4 gap-4">
          <p>Are you sure you want to delete this group?</p>
          <div className="flex flex-row gap-4">
            <FramedButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenSignal(false);
              }}
            >
              <p>Cancel</p>
            </FramedButton>
            <FramedButton
              onClick={(e) => {
                e.stopPropagation();
                trackAmplitudeData("Clicked Delete List", { id: listId });
                deleteList.mutate(listId);
                router.push("/dashboard");
              }}
            >
              <p className=" text-red-500">Delete group</p>
            </FramedButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
