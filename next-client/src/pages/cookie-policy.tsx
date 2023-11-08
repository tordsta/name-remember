import CookieTable from "@/components/CookieTable";
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
  const { consent, setConsent, toggleBanner } = useConsent();

  const necessaryCookies = [
    {
      name: "__Secure-next-auth.session-token",
      description:
        "This cookie is used by our website to securely manage session information for users. It is a part of our authentication system, which enables users to log in and stay logged in to our site. The cookie stores a unique session token that references the user's session in our servers, allowing for a seamless and secure user experience. This cookie is essential for recognizing user sessions and providing continuity as users navigate the site. It helps to ensure that any user-specific information that they have access to remains secure.",
      duration: "30 days",
    },
    {
      name: "__Secure-next-auth.callback-url",
      description:
        "The __Secure-next-auth.callback-url cookie is utilized by our authentication system to remember the last page visited by the user before they were prompted to log in. This functionality allows us to redirect the user back to that page after they have successfully authenticated. This provides a more intuitive and seamless user experience by eliminating the need for users to navigate back to their initial destination manually.",
      duration: "Expires as soon as the user's session ends.",
    },
    {
      name: "__Secure-next-auth.csrf-token",
      description:
        "The __Host-next-auth.csrf-token cookie is a security cookie used by our website to prevent Cross-Site Request Forgery (CSRF) attacks when users log in. This cookie generates a unique and random token that is used to verify that the requests sent to our server during a session are from the authenticated user, not an unauthorized third party. It is part of our authentication framework, ensuring that every session remains secure and that user data is protected against unauthorized access or manipulation.",
      duration: "Expires as soon as the user's session ends.",
    },
    {
      name: "__stripe_sid",
      description:
        "The __stripe_sid cookie is created by Stripe, which is the payment processing service we employ on our website. This cookie is essential for making secure payments through Stripe. It serves as a temporary session identifier that lasts for the duration of the user's visit on the site. The __stripe_sid cookie supports the checkout process and helps monitor and mitigate any fraudulent activities. It aids in the detection of suspicious payment behavior by correlating sessions with the user making the transaction, without storing any personally identifiable information.",
      duration: "30 minutes",
    },
    {
      name: "__stripe_mid",
      description:
        "The __stripe_mid cookie is set by Stripe, a payment processing service that we use to handle payments on our website. This cookie is part of Stripe's fraud prevention infrastructure and is used to provide a unique identifier for the device or browser in use. By doing this, Stripe can detect and prevent fraudulent activities, such as unauthorized payments and transaction disputes. The cookie does not store any personal information or financial details but rather generates a unique session ID to track user behavior with the aim of identifying and mitigating risk.",
      duration: "1 year",
    },
  ];
  const functionalCookies = [
    {
      name: "n/a",
      description: "n/a",
      duration: "n/a",
    },
  ];
  const analyticsCookies = [
    {
      name: "AMP_xxxxxxxxxx",
      description:
        "The AMP_xxxxxxxxxx cookie is utilized by our website's amplitude analytics framework. This cookie is instrumental for tracking user interaction within our site, enabling us to analyze usage patterns and optimize user experiences. It collects information on how users navigate through the site, which pages they visit, and how they interact with various elements of the website. This data is crucial for understanding user behavior and improving site functionality and content delivery.",
      duration: "1 year",
    },
    {
      name: "AMP_MKTG_xxxxxxxxxx",
      description:
        "The AMP_MKTG_xxxxxxxxxx cookie is utilized by our website's amplitude analytics framework. This cookie is instrumental for tracking user interaction within our site, enabling us to analyze usage patterns and optimize user experiences. It collects information on how users navigate through the site, which pages they visit, and how they interact with various elements of the website. This data is crucial for understanding user behavior and improving site functionality and content delivery.",
      duration: "1 years",
    },
  ];
  const performanceCookies = [
    {
      name: "n/a",
      description: "n/a",
      duration: "n/a",
    },
  ];
  const advertisementCookies = [
    {
      name: "n/a",
      description: "n/a",
      duration: "n/a",
    },
  ];

  return (
    <Layout title="Privacy Policy" auth={false} nav={false}>
      <div className="flex flex-col justify-center items-start m-8 md:mx-20 md:mt-10 md:mb-16 gap-4 font-sans">
        <div className="flex flex-row gap-4 items-center mb-4">
          <h1 className="text-2xl font-bold">COOKIE POLICY</h1>
          <button
            className="bg-white border border-black px-2 py-1"
            onClick={() => {
              //Fix for visual bug
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
        <CookieTable cookies={necessaryCookies} />
        <h3 className="text-xl">Functional</h3>
        <p>
          Functional cookies help perform certain functionalities like sharing
          the content of the website on social media platforms, collecting
          feedback, and other third-party features.
        </p>
        <CookieTable cookies={functionalCookies} />
        <h3 className="text-xl">Analytics</h3>
        <p>
          Analytical cookies are used to understand how visitors interact with
          the website. These cookies help provide information on metrics such as
          the number of visitors, bounce rate, traffic source, etc.
        </p>
        <CookieTable cookies={analyticsCookies} />
        <h3 className="text-xl">Performance</h3>
        <p>
          Performance cookies are used to understand and analyze the key
          performance indexes of the website which helps in delivering a better
          user experience for the visitors.
        </p>
        <CookieTable cookies={performanceCookies} />
        <h3 className="text-xl">Advertisement</h3>
        <p>
          Advertisement cookies are used to provide visitors with customized
          advertisements based on the pages you visited previously and to
          analyze the effectiveness of the ad campaigns.
        </p>
        <CookieTable cookies={advertisementCookies} />
      </div>
    </Layout>
  );
}
