import Button from "@/components/style/Button";
import Lists from "@/components/Lists";
import UserEmblem from "@/components/UserEmblem";

export default function Home() {
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
            <p>Everyone</p> {/*current list name*/}
            <ul>
              <li>Per</li>
              <li>Knut</li>
              <li>Paal</li>
            </ul>
            <Button onClick={() => {}}>Add Person</Button>
          </div>
        </div>
        <Lists />
      </div>
    </>
  );
}
