import Lists from "@/components/Lists";
import UserEmblem from "@/components/UserEmblem";
import { useState } from "react";
import CurrentList from "./CurrentList";
import Memorization from "./Memorization";

export default function Home() {
  const [currentList, setCurrentList] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="flex flex-row md:flex-col w-full md:w-52 justify-between border-b md:border-b-0 md:border-r border-black">
        <h1 className="text-3xl sm:text-4xl font-bold mx-8 md:mx-4 my-6">
          Name Remember
        </h1>
        <UserEmblem />
      </div>
      <div className="flex flex-col md:flex-col flex-grow w-full justify-start md:justify-between items-center">
        <div className="hidden">
          <Memorization currentList={currentList} />
          <CurrentList
            currentList={currentList}
            setCurrentList={setCurrentList}
          />
        </div>
        <Lists currentList={currentList} setCurrentList={setCurrentList} />
      </div>
    </div>
  );
}
