import Link from "next/link";
import React, { use, useCallback, useEffect, useState } from "react";
import {
  ConsentBanner,
  ConsentOptions,
  ConsentProvider,
} from "react-hook-consent";
import "react-hook-consent/dist/styles/style.css";

export default function CookieConsentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const consentOptions: ConsentOptions = {
    services: [
      {
        id: "necessary",
        name: "Necessary",
        description:
          "Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.",
        mandatory: true,
      },
      {
        id: "functional",
        name: "Functional",
        description:
          "Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features.",
      },
      {
        id: "analytics",
        name: "Analytics",
        description:
          "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.",
      },
      {
        id: "performance",
        name: "Performance",
        description:
          "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.",
      },
      {
        id: "advertisement",
        name: "Advertisement",
        description:
          "Advertisement cookies are used to provide visitors with customized advertisements based on the pages you visited previously and to analyze the effectiveness of the ad campaigns.",
      },
    ],
    theme: "light",
  };

  return (
    <ConsentProvider options={{ ...consentOptions }}>
      <div className=" font-sans">
        <ConsentBanner
          settings={{ hidden: false, label: "Customize" }}
          decline={{ label: "Only essentials" }}
          approve={{ label: "Accept all" }}
        >
          <p className="text-xl">We value your privacy</p>
          We use cookies to enhance your browsing experience, serve personalized
          ads or content, and analyze our traffic. By clicking &quot;Accept
          All&quot;, you consent to our use of cookies.{" "}
          <Link href={"/cookie-policy"}>Cookie Policy</Link>
        </ConsentBanner>
      </div>
      {children}
    </ConsentProvider>
  );
}
