import Button from "@/components/Button";
import Layout from "@/components/navigation/Layout";
import { useRouter } from "next/router";
import Faq from "@/components/salesPages/Faq";
import Features from "@/components/salesPages/Features";
import Link from "next/link";

export default function NewEmployee() {
  const router = useRouter();

  return (
    <Layout nav={false} auth={false}>
      <div className="flex flex-col justify-center items-center max-w-2xl gap-6 md:gap-12 mx-auto p-4 mb-4 md:mb-0">
        <div>
          <h1 className="text-2xl">🔍 The Challenge:</h1>
          <p className="text-lg pl-4 pt-1">
            You&apos;ve just started a new job, excited and ready to make a
            lasting impression. You&apos;re introduced to dozens of new faces
            and names on the first day, but by the end of the week, you find
            yourself stammering, &quot;Hey... you!&quot; because you can&apos;t
            recall their names. Sounds familiar?
          </p>
        </div>
        <div>
          <h2 className="text-2xl">🚀 The Solution:</h2>
          <p className="text-lg pl-4 pt-1">
            NameRemember - Your Ultimate Guide to Mastering Names! With our
            platform, never find yourself in that awkward situation again.
          </p>
        </div>
        <Button style="green" onClick={() => router.push("/email-sign-up")}>
          Sign up now
        </Button>
        <Features />
        {/* Implement when actual testimonial */}
        {/* <Testimonial display={[false, false, true]} title="💬 Hear from Satisfied Employees Like You!" /> */}
        {/* Implement this when premium features are implemented */}
        {/* <LimitedTimeOffer /> */}
        <Faq />
        <div className="flex flex-col gap-4 pb-0 md:pb-16">
          <p className="text-xl">
            💡 Remembering names is more than just a memory feat. It&apos;s
            about building strong connections, fostering trust, and showing
            respect.
          </p>
          <p className="text-xl">
            With NameRemember, you&apos;re not only boosting your memory but
            also paving the way for meaningful professional relationships.
          </p>
          <p className="text-xl">
            🟢 Ready to Embrace the Change?{" "}
            <Link href={"/email-sign-up"} className="underline text-blue-500 ">
              Join NameRemember Today and Start Making Lasting Impressions!
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
