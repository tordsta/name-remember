import Lists from "@/components/Lists";
import UserEmblem from "@/components/UserEmblem";

export default function Home() {
  return (
    <div className="w-full grow flex flex-col md:flex-row">
      <div className="flex flex-row grow md:flex-col w-full md:w-52 justify-between border-b md:border-b-0 md:border-r border-black">
        <h1 className="text-3xl sm:text-4xl font-bold mx-8 md:mx-4 my-6">
          Name Remember
        </h1>
        <UserEmblem />
      </div>
      <div className="flex flex-col md:flex-col flex-grow w-full justify-start md:justify-between items-center">
        <Lists />
      </div>
    </div>
  );
}
