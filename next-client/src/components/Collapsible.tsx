import { default as Cl } from "react-collapsible";
import Image from "next/image";

export default function Collapsible({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <Cl
      className="text-xl"
      openedClassName="text-xl"
      trigger={
        <div className="flex flex-row">
          {title}

          <Image
            src={"/backChevron.svg"}
            height={20}
            width={20}
            alt="expand"
            className="-rotate-90 mx-2"
          />
        </div>
      }
      triggerWhenOpen={
        <div className="flex flex-row">
          {title}
          <Image
            src={"/backChevron.svg"}
            height={20}
            width={20}
            alt="expand"
            className="rotate-90 mx-2"
          />
        </div>
      }
    >
      {children}
    </Cl>
  );
}
