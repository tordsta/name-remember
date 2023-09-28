import Layout from "@/components/navigation/Layout";
import { trackAmplitudeData } from "@/lib/amplitude";
import { useEffect } from "react";

export default function TermsAndConditions() {
  useEffect(() => {
    trackAmplitudeData("Loaded Page Terms and Conditions");
  }, []);

  return (
    <Layout title="Privacy Policy" auth={false} nav={false}>
      <div className="flex flex-col justify-center items-start m-8 md:mx-20 md:my-10 gap-4 font-sans">
        <p className="text-xl">Nordlent AS - TERMS AND CONDITIONS</p>
        <p className="text-xl">1. Introduction</p>
        Welcome to Nordlent AS. This is a binding agreement between Nordlent AS
        (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) and you
        (&quot;user&quot;, &quot;you&quot;, &quot;your&quot;). By using our
        website and/or our software services (&quot;Service&quot;), you agree to
        these Terms and Conditions.
        <p className="text-xl">2. Using our Service</p>
        You must follow any guidelines or policies associated with the Service.
        You must not misuse or interfere with the Service or try to access them
        using a method other than the interface and the instructions that we
        provide.
        <p className="text-xl">3. Account Creation and Security</p>
        You may need to create an account to use our Service. You are
        responsible for safeguarding your account, and you must use a strong
        password and limit its use to this account. We cannot and will not be
        liable for any loss or damage arising from your failure to comply with
        these requirements.
        <p className="text-xl">4. Privacy</p>
        Our Privacy Policy describes how we handle the personal information you
        provide to us when you use our Service. You understand that through your
        use of the Service, you consent to the collection and use of this
        information.
        <p className="text-xl">5. Intellectual Property Rights</p>
        All intellectual property rights in the Service are owned by us. Except
        as expressly provided, these terms do not grant you any rights to, under
        or in, any patents, copyright, database right, trade secrets, trade
        names, trademarks (whether registered or unregistered), or any other
        rights or licenses in respect of the Service.
        <p className="text-xl">6. Limitation of Liability</p>
        We provide the Service on an &quot;as is&quot; and &quot;as
        available&quot; basis. To the extent permitted by law, we make no
        warranties, either express or implied, about the Service. We are not
        liable for any loss or damage that may come from using our Service.
        <p className="text-xl">7. Changes to These Terms</p>
        We reserve the right to modify these Terms at any time. If we do so, we
        will post the changes on this page. Your continued use of the Service
        means you agree to the updated terms.
        <p className="text-xl">8. Governing Law and Jurisdiction</p>
        These Terms and Conditions are governed by and construed in accordance
        with the laws of Norway. You irrevocably submit to the exclusive
        jurisdiction of the courts in that State or location.
        <p className="text-xl">9. Contact Us</p>
        If you have any questions about these Terms, please contact us:
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
