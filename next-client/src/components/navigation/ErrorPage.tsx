import FeedbackForm from "../FeedbackForm";
import Layout from "./Layout";

export default function Error() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-start w-full gap-4 p-10 md:p-32">
        <h1 className="text-xl mx-auto">Internal Error</h1>
        <p>We’re sorry, something seems to have gone wrong on our end.</p>
        <p>What you can do:</p>
        <ul>
          <li>- Try refreshing the page. Sometimes, that’s all it takes.</li>
          <li className="py-2 gap-4 flex justify-start items-center">
            <p>- Try to submit a bug report here:</p>
            <FeedbackForm />
          </li>
          <li>
            - If the problem persists, please come back later. We should have
            things back to normal soon.
          </li>
        </ul>
        We apologize for any inconvenience and appreciate your patience and
        understanding.
      </div>
    </Layout>
  );
}
