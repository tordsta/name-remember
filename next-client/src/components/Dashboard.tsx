import Button from "@/components/style/Button";
import Lists from "@/components/Lists";
import UserEmblem from "@/components/UserEmblem";
import { useState } from "react";
import { usePeopleList } from "@/hooks/usePeopleList";
import useAddPeople from "@/hooks/useAddPeople";
import useDeletePeople from "@/hooks/useDeletePeople";

export default function Home() {
  const [currentList, setCurrentList] = useState<string | null>(null);
  const { data, isLoading, error } = usePeopleList({ id: currentList });
  const addPeople = useAddPeople();
  const deletePerson = useDeletePeople();

  return (
    <>
      <div className="flex w-full justify-between border-b border-white">
        <h1 className="text-2xl sm:text-4xl font-bold mx-8 my-6">
          Name Remember
        </h1>
        <UserEmblem />
      </div>
      <div className="flex flex-col md:flex-row flex-grow justify-start md:justify-between items-center my-8 md:my-20 mx-2">
        <div className="flex flex-col text-center justify-center items-center">
          <Button onClick={() => console.log("clicked start memorization")}>
            <p>Start Memorization</p>
          </Button>
          <div className="mt-8">
            <div>
              {isLoading && <div>Loading... </div>}
              {!isLoading && !error && data && (
                <div>
                  <p className="text-2xl font-bold">{data.name}</p>
                  {data.people_in_list &&
                    data.people_in_list.length > 0 &&
                    data.people_in_list.map((person) => {
                      return (
                        <div
                          key={person.id}
                          className="flex justify-center items-center gap-2 m-2"
                        >
                          <p>
                            {person.fname} {person.lname}
                          </p>
                          <button
                            onClick={() => {
                              if (person.id) {
                                console.log("delete person");
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
            </div>
            <Button
              onClick={() => {
                if (currentList) {
                  addPeople.mutate({
                    listId: currentList,
                    person: { fname: "test" },
                  });
                }
              }}
            >
              Add Person
            </Button>
          </div>
        </div>
        <Lists currentList={currentList} setCurrentList={setCurrentList} />
      </div>
    </>
  );
}
