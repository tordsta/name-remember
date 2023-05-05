export default function StyledButton({
  onClick,
  onSubmit,
  children,
}: {
  onClick: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="border-2 border-black dark:border-white rounded-md px-4 py-2 h-min"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SmallButton({
  onClick,
  onSubmit,
  children,
}: {
  onClick: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="border border-black dark:border-white rounded-md px-2 py-1 h-min"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function GreenButton({
  onClick,
  onSubmit,
  children,
}: {
  onClick: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className=" bg-green-600 border-2 border-black dark:border-white rounded-md px-4 py-2 h-min"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
