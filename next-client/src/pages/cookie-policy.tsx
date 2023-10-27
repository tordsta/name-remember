import Layout from "@/components/navigation/Layout";
import { useConsent } from "react-hook-consent";

//https://gdpr.eu/cookies/
// To comply with the regulations governing cookies under the GDPR and the ePrivacy Directive you must:

// Receive users’ consent before you use any cookies except strictly necessary cookies.
// Provide accurate and specific information about the data each cookie tracks and its purpose in plain language before consent is received.
// Document and store consent received from users.
// Allow users to access your service even if they refuse to allow the use of certain cookies
// Make it as easy for users to withdraw their consent as it was for them to give their consent in the first place.

export default function CookiePolicy() {
  const { consent, setConsent, isBannerVisible, toggleBanner } = useConsent();

  return (
    <Layout title="Privacy Policy" auth={false} nav={false}>
      <div className="flex flex-col justify-center items-start m-8 md:mx-20 md:mt-10 md:mb-16 gap-4 font-sans">
        <div className="flex flex-row gap-4 items-center mb-4">
          <h1 className="text-2xl font-bold">COOKIE POLICY</h1>
          <button
            className="bg-white border border-black px-2 py-1"
            onClick={() => {
              if (consent.length == 0) {
                setConsent(["necessary"]);
              }
              toggleBanner();
            }}
          >
            Cookie settings
          </button>
        </div>
        <h2 className="text-2xl">What Are Cookies</h2>
        <p>
          This Cookie Policy explains what cookies are and how we use them, the
          types of cookies we use i.e, the information we collect using cookies
          and how that information is used, and how to manage the cookie
          settings.
        </p>
        <p>
          Cookies are small text files that are used to store small pieces of
          information. They are stored on your device when the website is loaded
          on your browser. These cookies help us make the website function
          properly, make it more secure, provide better user experience, and
          understand how the website performs and to analyze what works and
          where it needs improvement.
        </p>
        <h2 className="text-2xl">How We Use Cookies</h2>
        <p>
          As most of the online services, our website uses first-party and
          third-party cookies for several purposes. First-party cookies are
          mostly necessary for the website to function the right way, and they
          do not collect any of your personally identifiable data.
        </p>
        <p>
          The third-party cookies used on our website are mainly for
          understanding how the website performs, how you interact with our
          website, keeping our services secure, providing advertisements that
          are relevant to you, and all in all providing you with a better and
          improved user experience and help speed up your future interactions
          with our website.
        </p>
        <h2 className="text-2xl">Types of Cookies we use</h2>
        <h3 className="text-xl">Necessary</h3>
        <p>
          Necessary cookies are required to enable the basic features of this
          site, such as providing secure log-in or adjusting your consent
          preferences. These cookies do not store any personally identifiable
          data.
        </p>
        <h3 className="text-xl">Functional</h3>
        <p>
          Functional cookies help perform certain functionalities like sharing
          the content of the website on social media platforms, collecting
          feedback, and other third-party features.
        </p>
        <h3 className="text-xl">Analytics</h3>
        <p>
          Analytical cookies are used to understand how visitors interact with
          the website. These cookies help provide information on metrics such as
          the number of visitors, bounce rate, traffic source, etc.
        </p>
        <h3 className="text-xl">Performance</h3>
        <p>
          Performance cookies are used to understand and analyze the key
          performance indexes of the website which helps in delivering a better
          user experience for the visitors.
        </p>
        <h3 className="text-xl">Advertisement</h3>
        <p>
          Advertisement cookies are used to provide visitors with customized
          advertisements based on the pages you visited previously and to
          analyze the effectiveness of the ad campaigns.
        </p>
      </div>
    </Layout>
  );
}
