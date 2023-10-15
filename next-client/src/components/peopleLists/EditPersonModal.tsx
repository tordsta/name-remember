import Button from "../Button";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import NextImage from "next/image";
import { notifyWarning } from "../Notify";
import resizeImage from "@/utils/resizeImage";
import useUpdatePeople from "@/lib/reactQuery/clientHooks/useUpdatePeople";
import { Person } from "@/utils/types";

export default function EditPersonModal({ person }: { person: Person }) {
  const [openSignal, setOpenSignal] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [fname, setFname] = useState<string>(person.fname ?? "");
  const [mname, setMname] = useState<string>(person.mname ?? "");
  const [lname, setLname] = useState<string>(person.lname ?? "");
  const [imageFile, setImageFile] = useState<string | null>(
    person.image ?? null
  );

  const updatePeople = useUpdatePeople();

  useEffect(() => {
    if (imageFile) {
      setDisableSubmit(false);
    }
  }, [imageFile]);

  const handleUpdatePerson = async (event: React.FormEvent) => {
    event.preventDefault();
    if (disableSubmit) {
      notifyWarning("Please wait for the image to process and try again.");
      return;
    }

    updatePeople.mutate({
      person: {
        id: person.id,
        fname: fname,
        mname: mname,
        lname: lname,
        image: imageFile ?? null,
        list_id: person.list_id,
      },
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
      <div
        className="relative w-8 h-8 overflow-hidden cursor-pointer"
        onClick={() => {
          setFname(person.fname ?? "");
          setMname(person.mname ?? "");
          setLname(person.lname ?? "");
          setImageFile(person.image ?? null);
          setOpenSignal(true);
        }}
      >
        <NextImage
          src={"/icons/editFramed110x110.png"}
          alt="Uploaded image"
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
        />
      </div>

      <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col justify-center items-end text-center m-4 gap-4">
          <p className="text-xl w-full text-center">Update Member Info</p>
          <label>
            First name{" "}
            <input
              name="fname"
              type="text"
              defaultValue={fname}
              onChange={(e) => setFname(e.target.value)}
              className="border border-black rounded mx-1 px-1"
            />
          </label>
          <label>
            Middle name{" "}
            <input
              name="mname"
              type="text"
              defaultValue={mname}
              onChange={(e) => setMname(e.target.value)}
              className="border border-black rounded mx-1 px-1"
            />
          </label>
          <label>
            Last name{" "}
            <input
              name="lname"
              type="text"
              defaultValue={lname}
              onChange={(e) => setLname(e.target.value)}
              className="border border-black rounded mx-1 px-1"
            />
          </label>
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
            <Button onClick={handleUpdatePerson} style={"submit"} />
          </div>
        </div>
      </Modal>
    </>
  );
}
