import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import Button from "../Button";
import NextImage from "next/image";
import resizeImage from "@/utils/resizeImage";
import useAddPeople from "@/lib/reactQuery/clientHooks/useAddPeople";
import { trackAmplitudeData } from "@/lib/amplitude";
import { notifyWarning } from "../Notify";

export default function AddPerson({
  listId,
  setOpenSignal = () => {},
}: {
  listId: string;
  setOpenSignal?: Dispatch<SetStateAction<boolean>>;
}) {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const addPeople = useAddPeople();

  useEffect(() => {
    if (imageFile) {
      setDisableSubmit(false);
    }
  }, [imageFile]);

  const handleAddPerson = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disableSubmit) {
      notifyWarning("Please wait for the image to process and try again.");
      return;
    }

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
    setDisableSubmit(true);
    setOpenSignal(false);
  };

  const handleImageChange = async (event: React.ChangeEvent) => {
    setDisableSubmit(true);
    event.preventDefault();
    const file = (event.target as any).files[0];
    if (!file) return;

    const targetSizeKb = 200;
    await resizeImage({ file, targetSizeKb, setImageFile });
  };

  return (
    <>
      {/* mobile version */}
      <form
        onSubmit={handleAddPerson}
        className="flex flex-col items-end justify-center gap-4 m-4 md:hidden"
      >
        <p className="text-xl w-full text-center">Add Member</p>
        <label>
          First name
          <input
            name="fname"
            type="text"
            required
            className="border border-black rounded mx-1 px-1"
          />
        </label>
        <label>
          Middle name
          <input
            name="mname"
            type="text"
            className="border border-black rounded mx-1 px-1"
          />
        </label>
        <label>
          Last name
          <input
            name="lname"
            type="text"
            className="border border-black rounded mx-1 px-1"
          />
        </label>
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
        <div className="flex justify-center items-center gap-2 w-full">
          <Button style={"cancel"} onClick={() => setOpenSignal(false)} />
          <Button style="submit" typeSubmit={true} />
        </div>
      </form>
      {/* desktop version */}
      <form
        onSubmit={handleAddPerson}
        className="hidden md:flex flex-row justify-center items-center"
      >
        <input
          name="fname"
          type="text"
          required
          className="border border-black rounded mx-2 px-1"
        />
        <input
          name="mname"
          type="text"
          className="border border-black rounded mx-2 px-1"
        />
        <input
          name="lname"
          type="text"
          className="border border-black rounded mx-2 px-1"
        />
        <input
          className="w-full"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button
          className={`border border-black px-2 rounded ${
            disableSubmit ? "bg-gray-400" : "bg-emerald-400"
          }`}
          type={"submit"}
          disabled={disableSubmit}
        >
          Submit
        </button>
      </form>
    </>
  );
}
