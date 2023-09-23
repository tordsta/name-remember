import React, { useEffect, useState } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { Person } from "@/utils/types";
import Image from "next/image";
import { FramedButton } from "./Button";
import { track } from "@amplitude/analytics-browser";
import { trackAmplitudeData } from "@/lib/amplitude";

export default function Memorization({
  currentList,
  data,
  isError,
  isLoading,
}: {
  currentList: string | null;
  data: any;
  isError: boolean;
  isLoading: boolean;
}) {
  //TODO make it snap to the elements
  const { scrollRef, pages, activePageIndex, next, prev, goTo, refresh } =
    useSnapCarousel();
  const [answers, setAnswers] = useState<
    Array<{
      fnameRes: boolean;
      mnameRes: boolean;
      lnameRes: boolean;
      index: number;
      person: Person;
    }>
  >([]);

  useEffect(() => {
    refresh();
  }, [data, refresh]);

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

    trackAmplitudeData("Memorization Check Answer", {
      fnameRes,
      mnameRes,
      lnameRes,
      index,
      person,
    });
  };

  return (
    <div className="flex flex-col my-auto justify-center items-center md:flex-row md:justify-start md:items-stretch w-auto md:w-full min-h-0 md:min-h-screen">
      <div
        className="hidden md:block flex-grow bg-gray-200 border border-black cursor-pointer"
        onClick={() => {
          track("Memorization Previous Clicked", {
            currentList,
            activePageIndex,
          });
          prev();
        }}
      >
        <p className="text-2xl text-center h-full w-full px-2 min-w-[120px] flex items-center justify-center">
          Previous
        </p>
      </div>

      <ul
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "row",
          overflow: "auto",
          scrollSnapType: "x mandatory",
          minWidth: "350px",
          width: "100%",
          margin: "0 auto",
        }}
        className="max-w-full md:w-auto md:max-w-[40vw] p-0"
      >
        {data &&
          !isLoading &&
          !isError &&
          data.people_in_list &&
          data.people_in_list.length > 0 &&
          currentList &&
          data.people_in_list.map((person: Person, i: number) => (
            <li
              key={i}
              style={{
                width: "100%",
                flexShrink: 0,
                flexGrow: 1,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="text-3xl my-4">
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
                <label
                  htmlFor="fname"
                  className={person.fname ? "block" : "hidden"}
                >
                  First name{"  "}
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    className="border border-black px-1"
                  />
                </label>
                <label
                  htmlFor="mname"
                  className={person.mname ? "block" : "hidden"}
                >
                  Middle name{"  "}
                  <input
                    id="mname"
                    name="mname"
                    type="text"
                    className="border border-black px-1"
                  />
                </label>
                <label
                  htmlFor="lname"
                  className={person.lname ? "block" : "hidden"}
                >
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
                  <div
                    className={`${
                      person.fname ? "flex" : "hidden"
                    } flex-col items-center justify-center`}
                  >
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
                  <div
                    className={`${
                      person.mname ? "flex" : "hidden"
                    } flex-col items-center justify-center`}
                  >
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
                  <div
                    className={`${
                      person.lname ? "flex" : "hidden"
                    } flex-col items-center justify-center`}
                  >
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
      <div className="md:hidden flex flex-row justify-evenly items-center gap-4 sm:gap-20 my-4">
        <FramedButton
          onClick={() => {
            track("Memorization Previous Clicked", {
              currentList,
              activePageIndex,
            });
            prev();
          }}
        >
          Previous
        </FramedButton>
        <FramedButton
          onClick={() => {
            track("Memorization Next Clicked", {
              currentList,
              activePageIndex,
            });
            next();
          }}
        >
          Next
        </FramedButton>
      </div>
      <div
        className="hidden md:block flex-grow bg-gray-200 border border-black cursor-pointer"
        onClick={() => {
          track("Memorization Next Clicked", {
            currentList,
            activePageIndex,
          });
          next();
        }}
      >
        <p className="text-2xl text-center px-2 h-full w-full min-w-[120px] flex items-center justify-center">
          Next
        </p>
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
  );
}
