import { usePeopleList } from "@/lib/reactQuery/clientHooks/usePeopleList";
import useDeletePeople from "@/lib/reactQuery/clientHooks/useDeletePeople";
import NextImage from "next/image";
import { trackAmplitudeData } from "@/lib/amplitude";

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
        <div className="flex flex-col">
          <p className="text-2xl font-bold w-52">Group members</p>
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
                  <button
                    onClick={() => {
                      if (person.id) {
                        deletePerson.mutate(person.id);
                        trackAmplitudeData("Deleted Person", {
                          personId: person.id,
                          personName: `${person.fname} ${person.mname} ${person.lname}`,
                        });
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
