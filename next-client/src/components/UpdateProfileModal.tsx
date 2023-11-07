import { useEffect, useState } from "react";
import resizeImage from "@/utils/resizeImage";
import Modal from "./Modal";
import { useUser } from "@/lib/reactQuery/clientHooks/useUser";
import { notifyWarning } from "./Notify";
import NextImage from "next/image";
import Button, { FramedButton } from "./Button";
import useUpdateUser from "@/lib/reactQuery/clientHooks/useUpdateUser";

export default function UpdateProfileModal() {
  const [openSignal, setOpenSignal] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const user = useUser();

  const [name, setName] = useState<string>(user ? user.name : "");
  const [imageFile, setImageFile] = useState<string | null>(
    user ? user.image : null
  );

  const updateProfile = useUpdateUser();

  useEffect(() => {
    if (imageFile) {
      setDisableSubmit(false);
    }
  }, [imageFile]);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disableSubmit) {
      notifyWarning("Please wait for the image to process and try again.");
      return;
    }

    updateProfile.mutate({
      name: name,
      image: imageFile ?? null,
    });
    setOpenSignal(false);
  };

  const handleImageChange = async (event: React.ChangeEvent) => {
    event.preventDefault();
    setDisableSubmit(true);
    const file = (event.target as any).files[0];
    if (!file) return;

    const targetSizeKb = 200;
    await resizeImage({ file, targetSizeKb, setImageFile });
  };

  return (
    <>
      <FramedButton
        onClick={() => {
          setName(user.name ?? "");
          setImageFile(user.image ?? null);
          setOpenSignal(true);
        }}
      >
        Update Profile
      </FramedButton>

      <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col justify-center items-center text-center m-4 gap-4">
          <p className="text-xl w-full text-center">Update Profile Info</p>
          <p className="text-lg">Update name:</p>
          <input
            name="fname"
            type="text"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-black rounded mx-1 px-1"
          />
          <p className="text-lg">Upload a new photo:</p>
          <div className="mx-auto">
            {imageFile && (
              <NextImage
                src={imageFile}
                alt="Uploaded image"
                width={200}
                height={200}
                className="mt-2"
              />
            )}
          </div>
          <input
            className="my-2"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="flex justify-center items-center gap-2 w-full">
            <Button
              style={"cancel"}
              onClick={() => {
                setOpenSignal(false);
              }}
            />
            <Button onClick={handleUpdateProfile} style={"submit"} />
          </div>
        </div>
      </Modal>
    </>
  );
}
