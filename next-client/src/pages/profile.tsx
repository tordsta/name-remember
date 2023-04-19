import { useEffect } from "react";
import { useAuthContext } from "../utils/authContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const user = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user == null) router.push("/");
  }, [user, router]);

  return (
    <div>
      <p>protected</p>
    </div>
  );
}
