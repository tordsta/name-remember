export default function StyledButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="border-2 border-white rounded-md px-4 py-2 font-bold"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
