import Button from "@/components/style/Button";
import { usePeopleList } from "@/hooks/usePeopleList";
import useAddPeople from "@/hooks/useAddPeople";
import useDeletePeople from "@/hooks/useDeletePeople";

export default function List({ currentList }: { currentList: string | null }) {
  const { data, isLoading, error } = usePeopleList({
    id: currentList,
  });

  const addPeople = useAddPeople();
  const deletePerson = useDeletePeople();

  return (
    <div className="flex flex-col text-center justify-center items-center">
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
  );
}
