import Image from "next/image";

export default function Button({
  style,
  onClick,
  onSubmit,
  typeSubmit,
  children,
}: {
  style?: undefined | string | "small" | "green" | "cancel" | "submit";
  onClick?: (e?: any) => void;
  onSubmit?: () => void;
  typeSubmit?: boolean;
  children?: React.ReactNode;
}) {
  let twString: string;
  let elements: React.ReactNode | undefined;

  switch (style) {
    case undefined:
      twString = "border border-black bg-white px-3 py-1 h-min max-w-max";
      break;
    case "small":
      twString = "border border-black px-2 py-1 h-min max-w-max";
      break;
    case "green":
      twString =
        "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 max-w-max";
      break;
    case "cancel":
      twString =
        "border border-black bg-rose-400 rounded px-2 py-1 h-min max-w-max";
      elements = <p className="text-lg">Cancel</p>;
      break;
    case "submit":
      twString =
        "border border-black bg-emerald-400 rounded px-2 py-1 h-min max-w-max";
      elements = <p className="text-lg">Submit</p>;
      break;
    default:
      twString = style;
  }

  return (
    <button
      className={twString}
      onClick={onClick}
      onSubmit={onSubmit}
      type={typeSubmit ? "submit" : "button"}
    >
      {children && children}
      {elements && elements}
    </button>
  );
}

export function FramedButton({
  style,
  onClick,
  onSubmit,
  typeSubmit,
  children,
}: {
  style?: undefined | string | "small" | "green" | "cancel" | "submit";
  onClick?: (e?: any) => void;
  onSubmit?: () => void;
  typeSubmit?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      className="relative w-40 h-10"
      onClick={onClick}
      onSubmit={onSubmit}
      type={typeSubmit ? "submit" : "button"}
    >
      <Image src="/buttonFrame460x60.png" alt="button" fill />
      <div className="relative">{children && children}</div>
    </button>
  );
}
