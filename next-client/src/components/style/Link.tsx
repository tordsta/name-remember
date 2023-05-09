import Link from "next/link";

export default function CustomLink({
  href,
  children,
  style,
}: {
  href: string;
  children: React.ReactNode;
  style?: undefined | string;
}) {
  let twString;
  switch (style) {
    case undefined:
      twString = "text-lg flex gap-1";
      break;
    default:
      twString = style;
  }

  return (
    <Link href={href} className={twString}>
      {children}
    </Link>
  );
}
