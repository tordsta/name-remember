import { usePeopleList } from "@/hooks/usePeopleList";
import useDeletePeople from "@/hooks/useDeletePeople";
import Modal from "react-modal";
import NextImage from "next/image";
import AddPersonToListModal from "./AddPersonToListModal";

export default function ListOfPeople({
  currentList,
}: {
  currentList: string | null;
}) {
  const { data, isLoading, error } = usePeopleList({
    id: currentList,
  });

  const deletePerson = useDeletePeople();

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
    </>
  );
}

Modal.setAppElement("#__next");
