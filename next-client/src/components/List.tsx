import Button, { FramedButton } from "@/components/style/Button";
import { usePeopleList } from "@/hooks/usePeopleList";
import useAddPeople from "@/hooks/useAddPeople";
import useDeletePeople from "@/hooks/useDeletePeople";
import { useState } from "react";
import DefaultModal from "./Modal";
import Modal from "react-modal";
import NextImage from "next/image";

export default function List({ currentList }: { currentList: string | null }) {
  const [openSignal, setOpenSignal] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const { data, isLoading, error } = usePeopleList({
    id: currentList,
  });

  const addPeople = useAddPeople();
  const deletePerson = useDeletePeople();

  const handleAddPerson = async (event: React.FormEvent) => {
    event.preventDefault();
    setOpenSignal(false);
    const fname = (event.target as any)["fname"].value;
    const mname = (event.target as any)["mname"].value;
    const lname = (event.target as any)["lname"].value;
    console.log(fname, mname, lname, imageFile);

    if (currentList && fname) {
      addPeople.mutate({
        listId: currentList,
        person: {
          fname: fname,
          mname: mname,
          lname: lname,
          image: imageFile ?? undefined,
        },
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent) => {
    const file = (event.target as any).files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(typeof reader.result === "string" ? reader.result : null);
      };
      reader.readAsDataURL(file);
    }

    //TODO fix image resizing
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //       const img = new Image();
    //       img.src = event.target.result;
    //       img.onload = () => {
    //           const elem = document.createElement('canvas');
    //           const scaleFactor = 0.8; // Adjust scaleFactor to get the size you want
    //           elem.width = img.width * scaleFactor;
    //           elem.height = img.height * scaleFactor;
    //           const ctx = elem.getContext('2d');
    //           // img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    //           ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, elem.width, elem.height);
    //           ctx.canvas.toBlob((blob) => {
    //               const newFile = new File([blob], file.name, {
    //                   type: 'image/jpeg',
    //                   lastModified: Date.now()
    //               });
    //               reader.onloadend = () => {
    //                   setImageFile(reader.result);
    //               };
    //               reader.readAsDataURL(newFile);
    //           }, 'image/jpeg', 1);
    //       },
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  return (
    <>
      {isLoading && <div>Loading... </div>}
      {!isLoading && !error && data && (
        <div className="flex flex-col mt-4">
          <p className="text-2xl font-bold w-52">People</p>
          {data.people_in_list &&
            data.people_in_list.length > 0 &&
            data.people_in_list.map((person) => {
              return (
                <div
                  key={person.id}
                  className="flex h-12 justify-start items-center gap-4 mt-2 border-b border-black"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <NextImage
                      src={person.image ?? "/icons/person110x110.png"}
                      alt="Uploaded image"
                      fill
                      sizes="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <p>
                    {person.fname} {person.mname} {person.lname}
                  </p>
                  <div className="grow" />
                  {/** TODO make edit button */}
                  <button
                    onClick={() => {
                      if (person.id) {
                        deletePerson.mutate(person.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
      )}
      <div className="mt-auto pt-2">
        <FramedButton onClick={() => setOpenSignal(true)}>
          Add Person
        </FramedButton>
      </div>
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
      {/* form with fname mname lname and picture */}
    </>
  );
}

Modal.setAppElement("#__next");
