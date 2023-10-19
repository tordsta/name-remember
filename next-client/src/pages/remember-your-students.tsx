import Button from "@/components/Button";
import Layout from "@/components/navigation/Layout";
import { useRouter } from "next/router";
import Faq from "@/components/faq";

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
        <div>
          <h2 className="text-2xl">Features ✨</h2>
          <ul className="list-inside pl-4">
            <li className="text-lg py-1">
              📌 Photo Integration: Upload class photos and tag each student
              with their name.
            </li>
            <li className="text-lg py-1">
              📌 Quizzes: Challenge yourself with quizzes that test your name
              recall ability.
            </li>
            <li className="text-lg py-1">
              📌 Mobile Friendly: Practice on-the-go with our mobile-optimized
              website.
            </li>
            <li className="text-lg py-1">
              📌 Email Reminders: Receive daily or weekly reminders directly in
              your inbox, helping you stay consistent in your practice.
            </li>
            {/* <li>📌 Track Progress: Watch your improvement over time with our analytics dashboard.</li> */}
          </ul>
        </div>
        {/* Implement when actual testimonial */}
        {/* <div>
            <h2 className="text-2xl">
              💬 Here’s What Other Teachers Are Saying:
            </h2>
            <p className="text-lg pl-4 pt-1">
              &quot;With NameRemember, the start of the school year has never
              been smoother. I could confidently call each student by their name
              within a week!&quot; - Ms. Johnson, 4th Grade Teacher
            </p>
            <p className="text-lg pl-4 pt-1">
              &quot;The personalized memory techniques are a game changer. It's
              not just about rote memorization, it's about really connecting
              with each student.&quot; - Mr. Garcia, High School History Teacher
            </p>
          </div> */}
        {/* implement this when premium features are implemented */}
        {/* <div>
            <h2 className="text-2xl">🎁 Limited Time Offer!</h2>
            <Button style="green" onClick={() => router.push("/email-sign-up")}>
              cta
            </Button>
            <p className="text-lg pl-4 pt-1">
              Sign up today and get 30 days FREE premium access to all features
              of NameRemember. That’s a whole month to witness the
              transformation in your classroom interactions.
            </p>
          </div> */}
        <Faq />
      </div>
    </Layout>
  );
}
