export default function Button({
  style,
  onClick,
  onSubmit,
  typeSubmit,
  children,
}: {
  style?: undefined | string | "small" | "green" | "cancel" | "submit";
  onClick?: () => void;
  onSubmit?: () => void;
  typeSubmit?: boolean;
  children?: React.ReactNode;
}) {
  let twString: string;
  let elements: React.ReactNode | undefined;

  switch (style) {
    case undefined:
      twString =
        "border-2 border-black dark:border-white rounded-md px-4 py-2 h-min";
      break;
    case "small":
      twString =
        "border border-black dark:border-white rounded-md px-2 py-1 h-min";
      break;
    case "green":
      twString =
        "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded";
      break;
    case "cancel":
      twString =
        "border border-black dark:border-white bg-rose-400 rounded px-2 py-1 h-min";
      elements = <p className="text-lg">Cancel</p>;
      break;
    case "submit":
      twString =
        "border border-black dark:border-white bg-emerald-400 rounded px-2 py-1 h-min";
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
