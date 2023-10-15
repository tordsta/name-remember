import { trackAmplitudeData } from "@/lib/amplitude";
import { FramedButton } from "../Button";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "../Modal";
import { notifyPromiseFetch } from "../Notify";
import { signOut } from "next-auth/react";

export default function DeleteProfileButton() {
  const router = useRouter();
  const [openSignal, setOpenSignal] = useState(false);

  return (
    <>
      <FramedButton onClick={() => setOpenSignal(true)}>
        <p className=" text-red-500">Delete my profile</p>
      </FramedButton>
      <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col justify-center items-center text-center m-4 gap-4">
          <p>Are you sure you want to delete your profile and all your data?</p>
          <p>This action is not reversible.</p>
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
              onClick={async (e) => {
                e.stopPropagation();
                trackAmplitudeData("Clicked Delete Profile");
                const res = await notifyPromiseFetch({
                  url: "/api/crud/deleteProfile",
                  body: JSON.stringify({}),
                  pending: "Deleting profile...",
                  success: "Profile deleted",
                  error: "Error deleting profile",
                });
                if (res.status === 200) {
                  signOut();
                  router.push("/");
                }
              }}
            >
              <p className=" text-red-500">Delete my profile</p>
            </FramedButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
