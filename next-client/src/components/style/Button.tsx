export default function Button({
  style,
  onClick,
  onSubmit,
  typeSubmit,
  children,
}: {
  style?: undefined | string | "small" | "green";
  onClick: () => void;
  onSubmit?: () => void;
  typeSubmit?: boolean;
  children: React.ReactNode;
}) {
  let twString;
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
      {children}
    </button>
  );
}
