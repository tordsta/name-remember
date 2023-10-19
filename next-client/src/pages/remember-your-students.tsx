import Button from "@/components/Button";
import Layout from "@/components/navigation/Layout";
import { useRouter } from "next/router";
import Faq from "@/components/salesPages/Faq";
import Features from "@/components/salesPages/Features";

export default function RememberYourStudents() {
  const router = useRouter();

  return (
    <Layout nav={false} auth={false}>
      <div className="flex flex-col justify-center items-center max-w-2xl gap-6 md:gap-12 mx-auto p-4 mb-4 md:mb-0">
        <div>
          <h1 className="text-2xl">
            Do you struggle with remembering your students’ names?
          </h1>
          <p className="text-lg pl-4 pt-1">
            You’re not alone. Every new school year brings in a fresh set of
            faces, each one attached to a unique name. For educators, making
            personal connections with students is paramount, but with so many
            names to recall, it can be overwhelming.
          </p>
        </div>
        <div>
          <h2 className="text-2xl">Never Forgetting a Student’s Name Again!</h2>
          <p className="text-lg pl-4 pt-1">
            Welcome to NameRemember – the innovative website designed for
            teachers like you. We understand the importance of calling a student
            by their name; it builds trust, fosters a positive classroom
            environment, and shows you care.
          </p>
        </div>
        <Button style="green" onClick={() => router.push("/email-sign-up")}>
          Sign up now
        </Button>
        <Features />
        {/* Implement when actual testimonial */}
        {/* <Testimonial display={[true, true, false]} title={"💬 Here’s What Other Teachers Are Saying:"} /> */}
        {/* Implement this when premium features are implemented */}
        {/* <LimitedTimeOffer /> */}
        <Faq />
      </div>
    </Layout>
  );
}
