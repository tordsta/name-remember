import { useState } from "react";
import DefaultModal from "./Modal";
import Button, { FramedButton } from "./Button";
import NextImage from "next/image";
import resizeImage from "@/utils/resizeImage";
import useAddPeople from "@/hooks/useAddPeople";
import { trackAmplitudeData } from "@/lib/amplitude";

export default function AddPersonToListModal({ listId }: { listId: string }) {
  const [openSignal, setOpenSignal] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const addPeople = useAddPeople();

  const handleAddPerson = async (event: React.FormEvent) => {
    event.preventDefault();
    setOpenSignal(false);
    const fname = (event.target as any)["fname"].value;
    const mname = (event.target as any)["mname"].value;
    const lname = (event.target as any)["lname"].value;

    if (listId && fname) {
      addPeople.mutate({
        listId: listId,
        person: {
          fname: fname,
          mname: mname,
          lname: lname,
          image: imageFile ?? undefined,
        },
      });
    }
    trackAmplitudeData("Add person", { fname, mname, lname, listId });
  };

  const handleImageChange = async (event: React.ChangeEvent) => {
    event.preventDefault();
    const file = (event.target as any).files[0];

    const targetSizeKb = 200;
    await resizeImage({ file, targetSizeKb, setImageFile });
  };

  return (
    <>
      <FramedButton onClick={() => setOpenSignal(true)}>
        Add Person
      </FramedButton>
      <DefaultModal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="text-xl text-center mt-4">Add person</div>
        <form onSubmit={handleAddPerson} className="flex flex-col m-4">
          <div className="flex flex-col md:flex-row-reverse">
            <div className="flex flex-col items-end justify-center gap-4">
              <label>
                First name
                <input
                  name="fname"
                  type="text"
                  required
                  className="border border-black rounded mx-2 px-1"
                />
              </label>
              <label>
                Middle name
                <input
                  name="mname"
                  type="text"
                  className="border border-black rounded mx-2 px-1"
                />
              </label>
              <label>
                Last name
                <input
                  name="lname"
                  type="text"
                  className="border border-black rounded mx-2 px-1"
                />
              </label>
            </div>
            <div className="flex flex-col justify-center items-center md:items-start gap-4 mt-4">
              {imageFile && (
                <NextImage
                  src={imageFile}
                  alt="Uploaded image"
                  width={200}
                  height={200}
                  className="mt-2"
                />
              )}
              <input
                className="my-2 w-full"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-4 md:mt-8">
            <Button style={"cancel"} onClick={() => setOpenSignal(false)} />
            <Button style="submit" typeSubmit={true} />
          </div>
        </form>
      </DefaultModal>
    </>
  );
}
