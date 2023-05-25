import { usePeopleList } from "@/hooks/usePeopleList";
import React, { useEffect, useState } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { Person } from "@/utils/types";
import Image from "next/image";
import { FramedButton } from "./style/Button";

export default function Memorization({
  currentList,
}: {
  currentList: string | null;
}) {
  //TODO make it snap to the elements
  const { scrollRef, pages, activePageIndex, next, prev, goTo, refresh } =
    useSnapCarousel();
  const { data, isLoading, error } = usePeopleList({ id: currentList });
  const [answers, setAnswers] = useState<
    Array<{
      fnameRes: boolean;
      mnameRes: boolean;
      lnameRes: boolean;
      index: number;
      person: Person;
    }>
  >([]);

  const handleAnswerCheck = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      person: { value: string };
      fname: { value: string };
      mname: { value: string };
      lname: { value: string };
      index: { value: number };
    };
    const person: Person = JSON.parse(target.person.value);
    const fnameRes = target.fname.value.trim() == person.fname;
    const mnameRes = target.mname.value.trim() == person.mname;
    const lnameRes = target.lname.value.trim() == person.lname;
    const index = target.index.value;
    setAnswers([...answers, { fnameRes, mnameRes, lnameRes, index, person }]);
    console.log("check answer", person, fnameRes, mnameRes, lnameRes, index);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div
        className="hidden lg:flex bg-gray-200 border border-black w-[50vw] items-center justify-center cursor-pointer"
        onClick={prev}
      >
        <p className="text-2xl">Previous</p>
      </div>

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
                height: "100vh",
                flexShrink: 0,
                flexGrow: 1,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="text-3xl mb-4">
                {activePageIndex + 1} / {pages.length}
              </p>
              <div className="relative w-52 h-52 bg-slate-200">
                <Image
                  src={person.image ?? "/icons/person110x110.png"}
                  alt="Uploaded image"
                  fill
                  sizes="100%"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <form
                onSubmit={handleAnswerCheck}
                className="flex flex-col items-end justify-center gap-4 my-6"
              >
                <label htmlFor="fname">
                  First name{"  "}
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    className="border border-black px-1"
                  />
                </label>
                <label htmlFor="mname">
                  Middle name{"  "}
                  <input
                    id="mname"
                    name="mname"
                    type="text"
                    className="border border-black px-1"
                  />
                </label>
                <label htmlFor="lname">
                  Last name{"  "}
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    className="border border-black px-1"
                  />
                </label>
                <input
                  id="person"
                  name="person"
                  type="hidden"
                  value={JSON.stringify(person)}
                />
                <input id="index" name="index" type="hidden" value={i} />
                <div className="mx-auto mt-4">
                  <FramedButton typeSubmit={true}>Check answer</FramedButton>
                </div>
              </form>
              {answers.filter((answer) => answer.index == i).length == 0 && (
                <div className="h-14 mb-8" />
              )}
              {answers.filter((answer) => answer.index == i).length > 0 && (
                <div className="flex flex-row items-center justify-evenly w-full h-14 mb-8 max-w-[500px]">
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={
                        answers
                          .filter((answer) => answer.index == i)
                          .slice(-1)[0].fnameRes
                          ? "/icons/checkmarkFramed110x110.png"
                          : "/icons/crossFramed110x110.png"
                      }
                      alt="checkmark"
                      width={30}
                      height={30}
                    />
                    <p>First Name</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={
                        answers
                          .filter((answer) => answer.index == i)
                          .slice(-1)[0].mnameRes
                          ? "/icons/checkmarkFramed110x110.png"
                          : "/icons/crossFramed110x110.png"
                      }
                      alt="checkmark"
                      width={30}
                      height={30}
                    />
                    <p>Middle Name</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={
                        answers
                          .filter((answer) => answer.index == i)
                          .slice(-1)[0].lnameRes
                          ? "/icons/checkmarkFramed110x110.png"
                          : "/icons/crossFramed110x110.png"
                      }
                      alt="checkmark"
                      width={30}
                      height={30}
                    />
                    <p>Last Name</p>
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
      <div
        className="hidden lg:flex bg-gray-200 border border-black w-[50vw] items-center justify-center cursor-pointer"
        onClick={next}
      >
        <p className="text-2xl">Next</p>
      </div>
      <div className="fixed lg:hidden bottom-0 w-full">
        <div className="flex flex-row justify-evenly items-center my-4 md:my-28">
          <FramedButton onClick={prev}>Previous</FramedButton>
          <FramedButton onClick={next}>Next</FramedButton>
        </div>
        {/* TODO make a final results page */}
        {/* TODO make a submit and storage of results */}
        {/* {pages.length == activePageIndex + 1 && (
          <div className="flex justify-center items-center my-4">
            <FramedButton onClick={() => console.log("submit")}>
              Submit Score
            </FramedButton>
          </div>
        )} */}
      </div>
    </div>
  );
}
