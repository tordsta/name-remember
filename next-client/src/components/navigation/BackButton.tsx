import { useRouter } from "next/router";
import Image from "next/image";

export default function BackButton({
  justChevron = false,
}: {
  justChevron?: boolean;
}) {
  const router = useRouter();
  if (router.pathname === "/dashboard") return <></>;

  if (justChevron)
    return (
      <div className="invert-0" onClick={() => router.push("/dashboard")}>
        <Image
          src="/backChevron.svg"
          alt=""
          aria-label="Back Icon"
          height={20}
          width={20}
        />
      </div>
    );

  return (
    <div
      className="flex items-center justify-center gap-1 pr-6 cursor-pointer"
      onClick={() => router.push("/dashboard")}
    >
      <div className="invert-0">
        <Image
          src="/backChevron.svg"
          alt=""
          aria-label="Back Icon"
          height={20}
          width={20}
        />
      </div>
      Back
    </div>
  );
}
