import Layout from "@/components/Layout";
import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    trackAmplitudeData("Loaded Page Privacy Policy");
  }, []);

  return (
    <Layout title="Privacy Policy" auth={false} nav={false}>
      <div className="flex flex-col justify-center items-start m-8 md:mx-20 md:my-10 gap-4 font-sans">
        <p className="text-xl">PRIVACY POLICY</p>
        <p className="text-xl">Effective date: 31.5.23</p>
        This Privacy Policy describes how Nordlent AS (&quot;we&quot;,
        &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your
        Personal Information when you visit or use our Name Remember.
        <p className="text-xl">1. Information We Collect</p>
        When you visit our Name Remember, we may collect the following
        information:
        <ul className="pl-4 list-disc list-inside">
          <li>
            Personal identification information: name, email address, phone
            number, etc.
          </li>
          <li>
            Technical data: IP address, browser type and version, time zone
            setting and location, browser plug-in types and versions, operating
            system and platform, and other technology on the devices you use to
            access this Name Remember.
          </li>
          <li>Usage data: information about how you use our Name Remember.</li>
        </ul>
        <p className="text-xl">2. How We Use Your Information</p>
        We use your Personal Information for the following purposes:
        <ul className="pl-4 list-disc list-inside">
          <li>To provide and maintain our Name Remember.</li>
          <li>To notify you about changes to our Name Remember.</li>
          <li>
            To allow you to participate in interactive features of our Name
            Remember.
          </li>
          <li>To provide customer support.</li>
        </ul>
        <p className="text-xl">3. Disclosure of Your Information</p>
        We may disclose your Personal Information in the following situations:{" "}
        <ul className="pl-4 list-disc list-inside">
          <li>To comply with a legal obligation.</li>
          <li>To protect and defend our rights or property.</li>
          <li>
            To prevent or investigate possible wrongdoing in connection with the
            Name Remember.
          </li>
          <li>
            To protect the personal safety of users of the Name Remember or the
            public.
          </li>
        </ul>
        <p className="text-xl">4. Cookies</p>
        We use cookies and similar tracking technologies to track activity on
        our Name Remember. Cookies are files with a small amount of data which
        may include an anonymous unique identifier.
        <p className="text-xl">5. Data Security</p>
        The security of your data is important to us. We use commercially
        acceptable means to protect your Personal Information, but remember that
        no method of transmission over the Internet, or method of electronic
        storage, is 100% secure.
        <p className="text-xl">6. Changes to This Privacy Policy</p>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
        <p className="text-xl">Contact Us</p>
        If you have any questions about this Privacy Policy, please contact us:
        <ul className="pl-4 list-disc list-inside">
          <li>
            By visiting this page on our website:
            https://nameremember.com/profile
          </li>
        </ul>
      </div>
    </Layout>
  );
}
