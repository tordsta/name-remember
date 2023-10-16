import Link from "next/link";

export default function LegalInfo() {
  return (
    <p className="text-[10px] text-gray-600 text-center my-4 w-48">
      By signing in you agree to our{" "}
      <Link href="/terms-and-conditions" className="underline">
        T&C
      </Link>{" "}
      and{" "}
      <Link href="/privacy-policy" className="underline">
        PP
      </Link>
      .
    </p>
  );
}
