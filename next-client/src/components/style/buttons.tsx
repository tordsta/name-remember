export default function StyledButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="border-2 border-black dark:border-white  rounded-md px-4 py-2 font-bold"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function GreenButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className=" bg-green-600 border-2 border-black dark:border-white rounded-md px-4 py-2 font-bold"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
