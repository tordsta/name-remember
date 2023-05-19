import { usePeopleList } from "@/hooks/usePeopleList";
import React, { use, useEffect, useState } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import Button from "./style/Button";
import { Person } from "@/utils/types";
export default function Memorization({
  currentList,
}: {
  currentList: string | null;
}) {
  const { scrollRef, pages, activePageIndex, next, prev, goTo, refresh } =
    useSnapCarousel();
  const { data, isLoading, error } = usePeopleList({ id: currentList });
  const [score, setScore] = useState<Array<any>>([]);

  useEffect(() => {
    refresh();
  }, [currentList, data, refresh]);

  const handleAnswerSubmission = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      person: { value: string };
      fname: { value: string };
      lname: { value: string };
      index: { value: number };
    };
    const person: Person = JSON.parse(target.person.value);
    const fname = target.fname.value;
    const lname = target.lname.value;
    const index = target.index.value;

    if (person.fname == fname) {
      console.log("correct");
      setScore((prev) => [...prev, { index, correct: true }]);
    }
  };

  return (
    <div className="w-[400px] border border-green-300">
      <Button onClick={() => console.log("clicked start memorization")}>
        <p>Start Memorization</p>
      </Button>

      <div className="flex items-center justify-center">
        <button onClick={() => prev()}>Prev</button>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {data &&
            !isLoading &&
            !error &&
            data.people_in_list.length > 0 &&
            currentList &&
            data.people_in_list.map((person, i) => (
              <li
                key={i}
                style={{
                  width: "100%",
                  height: "100%",
                  flexShrink: 0,
                  flexGrow: 1,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p className="text-xl m-2">
                  Memorizer nr. {activePageIndex + 1} / {pages.length}
                </p>
                <div className="w-52 h-52 bg-slate-400">Image</div>
                <form
                  onSubmit={handleAnswerSubmission}
                  className="flex flex-col items-center justify-center"
                >
                  <label htmlFor="fname">First name:</label>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    className="text-black"
                  />
                  <label htmlFor="lname">Last name:</label>
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    className="text-black"
                  />
                  <input
                    id="person"
                    name="person"
                    type="hidden"
                    value={JSON.stringify(person)}
                  />
                  <input id="index" name="index" type="hidden" value={i} />
                  <button type={"submit"}>Submit guess</button>
                </form>
              </li>
            ))}
        </ul>
        <button onClick={() => next()}>Next</button>
      </div>
    </div>
  );
}
