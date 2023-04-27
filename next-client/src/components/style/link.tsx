import Link from "next/link";

export default function StyledLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-lg flex gap-1">
      {children}
    </Link>
  );
}
