import Image from "next/image";

export default function LoadingAnimation({
  size,
}: {
  size?: "small" | "medium" | "large";
}) {
  let style;
  let widthAndHeight;
  switch (size) {
    case "small":
      style = "mx-auto absolute text-xs";
      widthAndHeight = 75;
      break;
    case "medium":
      style = "mx-auto absolute text-md";
      widthAndHeight = 100;
      break;
    case "large":
      style = "mx-auto absolute text-xl";
      widthAndHeight = 200;
      break;
    default:
      style = "mx-auto absolute text-md";
      widthAndHeight = 100;
      break;
  }
  return (
    <div className="flex flex-col w-full p-0 justify-center items-center">
      <h1 className={style}>Loading</h1>
      <Image
        src="/icons/loading.png"
        alt="Loading..."
        width={widthAndHeight}
        height={widthAndHeight}
        priority
        className="animate-spin16steps"
      />
    </div>
  );
}
