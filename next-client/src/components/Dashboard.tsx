import Lists from "@/components/Lists";
import UserEmblem from "@/components/UserEmblem";
import { useState } from "react";
import CurrentList from "./CurrentList";
import Memorization from "./Memorization";

export default function Home() {
  const [currentList, setCurrentList] = useState<string | null>(null);

  return (
    <>
      <div className="flex w-full justify-between border-b border-white">
        <h1 className="text-2xl sm:text-4xl font-bold mx-8 my-6">
          Name Remember
        </h1>
        <UserEmblem />
      </div>
      <div className="flex flex-col md:flex-row flex-grow justify-start md:justify-between items-center my-8 md:my-20 mx-2">
        <Memorization currentList={currentList} />
        <CurrentList
          currentList={currentList}
          setCurrentList={setCurrentList}
        />
        <Lists currentList={currentList} setCurrentList={setCurrentList} />
      </div>
    </>
  );
}
