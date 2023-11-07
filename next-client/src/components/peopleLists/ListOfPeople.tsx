import { usePeopleList } from "@/lib/reactQuery/clientHooks/usePeopleList";
import useDeletePeople from "@/lib/reactQuery/clientHooks/useDeletePeople";
import NextImage from "next/image";
import { trackAmplitudeData } from "@/lib/amplitude";
import Button from "../Button";
import EditPersonModal from "./EditPersonModal";
import LoadingAnimation from "../navigation/LoadingAnimation";

export default function ListOfPeople({ currentList }: { currentList: string }) {
  const { data, isLoading, error } = usePeopleList({
    id: currentList,
  });

  const deletePerson = useDeletePeople();

  return (
    <>
      {isLoading && <LoadingAnimation size="small" />}
      {!isLoading && !error && data && (
        <div className="flex flex-col">
          <p className="text-2xl font-bold w-52">Group members</p>
          {data.people_in_list &&
            data.people_in_list.length > 0 &&
            data.people_in_list.map((person) => {
              return (
                <div
                  key={person.id}
                  className="flex h-12 justify-start items-center gap-4 mt-2 pb-2 px-2 border-b border-black"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black">
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
                  <EditPersonModal person={person} />
                  <Button
                    style="small"
                    onClick={() => {
                      if (person.id) {
                        deletePerson.mutate({ person });
                        trackAmplitudeData("Deleted Person", {
                          personId: person.id,
                          personName: `${person.fname} ${person.mname} ${person.lname}`,
                        });
                      }
                    }}
                  >
                    <p className="text-sm">Delete</p>
                  </Button>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
