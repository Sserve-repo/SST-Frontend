import React from "react";

const Policies = () => {
  const collections = [
    {
      initial: "A",
      title: "Personal Information/Data",
      data: [
        "Full name",
        "Contact details (email, postal address, phone number)",
        "Account information",
        "Payment information (processed by third-party vendors)",
        "Government-issued identification (e.g., passport, driver's license) for service provider verification",
        "Compliance documentation (for service providers)",
        "Device identifier",
        "IP address",
      ],
    },
    {
      initial: "B",
      title: "User Profiles",
      data: [
        "Preferences",
        "Purchasing habits",
        "Data from surveys, reviews, and ratings",
      ],
    },
    {
      initial: "C",
      title: "Internet Activity Information",
      data: [
        "Browsing and search history on our platform",
        "Interactions with our services and advertisements",
      ],
    },
    {
      initial: "D",
      title: "Geolocation Data",
      data: [
        "GPS data to determine the exact location of service providers",
        "IP address or geotargeted ads to approximate customer locations",
      ],
    },
    {
      initial: "E",
      title: "Legally Protected Information",
      data: ["Gender", "Date of birth"],
    },
    {
      initial: "F",
      title: "Sensitive Data",
      data: [
        "Precise geolocation",
        "Government-issued IDs, such as passports or driver’s licenses",
      ],
    },
  ];

  const howWeUseYourData = [
    "To process and fulfill your service requests and orders, including scheduling, payments, and addressing complaints",
    "To communicate with you about our products, services, and promotions",
    "To personalize and enhance your experience on our platform",
    "To analyze and improve our products and services",
    "To protect the security and integrity of our services, including fraud detection and prevention",
  ];

  const trackingTechnologies = [
    {
      initial: "a",
      title: "Cookies",
      desc: "Small files stored on your device to optimize service functionality, remember your preferences, and analyze user behavior. You can disable cookies in your browser settings.",
    },
    {
      initial: "b",
      title: "Session Monitoring",
      desc: "We and our service providers track browsing behavior to enhance user experience and improve services.",
    },
    {
      initial: "c",
      title: "Social Account Login",
      desc: "If you log in via a social account (e.g., Google), we may collect relevant data to provide access to our services.",
    },
  ];

  const informationAboutOthers = [
    {
      initial: "a",
      title: "Referrals",
      desc: "If you use our referral service to invite someone to the platform, we collect their name and email to send a one-time invitation. We do not use this information for any other marketing purposes unless expressly stated.",
    },
    {
      initial: "b",
      title: "Ratings",
      desc: "If you rate a service provider, we may display your first name, last initial, and neighborhood along with your review on the provider's profile or in promotional materials.",
    },
  ];

  const communications = [
    {
      initial: "a",
      title: "Messaging Service Providers",
      desc: "You can communicate with service providers for service details or negotiations. Messages are encrypted, but we may use the data to improve service quality.",
    },
  ];

  const dataRetention = [
    "Manage our operations",
    "Fulfill your requests and support your relationship with us",
    "Defend or protect our legal rights",
  ];

  return (
    <div className=" grid grid-cols-1 bg-white min-h-screen w-full">
      <div className=" lg:m-[10rem] text-center flex flex-col gap-y-3">
        <p className="text-2xl text-[#502266] font-bold">Shop Policies</p>
        <div className="bg-[#502266] rounded-2xl h-auto text-white text-start px-8">
          <p className="p-4">Effective Date: September 13, 2024 </p>
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-2xl ">Introduction</h1>
            <p className="text-justify">
              At SphereServe Technologies Inc., we are committed to safeguarding
              your personal information and ensuring your privacy. This Privacy
              Policy outlines how we collect, use, disclose, and protect your
              data when you visit our website www.sserves.com, utilize our
              services, make purchases from sellers on our platform, or request
              services through it.
            </p>
          </div>
          {/*     1. Collection, Use, and Disclosure of Personal Information  */}
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-2xl ">
              1. Collection, Use, and Disclosure of Personal Information
            </h1>
            <h1 className="text-start text-xl ">i. Collection</h1>

            <p className="text-justify">
              We prioritize your privacy and are dedicated to securing your
              personal data. &quotPersonal Information&quot refers to any data
              directly or indirectly identifying you. This excludes publicly
              available information. We gather this data voluntarily when you
              engage with our website, service providers, or business partners.
              The categories of personal data collected include:
            </p>

            <div className="flex flex-col items-start justify-start gap-y-3">
              {collections &&
                collections.length > 0 &&
                collections.map((item: any, index: number) => {
                  return (
                    <div key={index} className="w-full mb-4 text-start">
                      <p className="font-bold mb-2">
                        {item.initial}. {item.title}
                      </p>
                      {item.data && (
                        <ul className="list-disc list-inside">
                          {item.data.map((subItem: any, itemIndex: number) => (
                            <li key={itemIndex}>{subItem}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          {/* ii. Consent */}
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-xl ">ii. Consent</h1>

            <p className="text-justify">
              By using our website and services, you consent to our collection,
              use, and disclosure of personal information as described in this
              Privacy Policy. You can withdraw your consent at any time by
              contacting us at unsubscribe@sserves.com. 
            </p>
          </div>
          {/* How We Use Your Data: */}
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-xl ">ii. How We Use Your Data:</h1>

            <div className="flex flex-col items-start justify-start ">
              {howWeUseYourData.map((item: any, index: number) => {
                return (
                  <ul className="list-disc list-inside">
                    <li key={index}>{item}</li>
                  </ul>
                );
              })}
            </div>
          </div>
          {/* 2. Tracking Technologies and Cookies */}
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-2xl ">
              2. Tracking Technologies and Cookies
            </h1>
            <p className="text-start ">
              We use various technologies to improve user experience and service
              efficiency. These include:
            </p>

            <div className="flex flex-col items-start justify-start gap-y-3">
              {trackingTechnologies.map((item: any, index: number) => {
                return (
                  <div key={index} className="w-full text-start">
                    <div>
                      {item.initial}.{" "}
                      <span className="font-bold">{item.title}</span>:{" "}
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/*  3. Information Provided About Others */}
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-2xl ">
              3. Information Provided About Others
            </h1>

            <div className="flex flex-col items-start justify-start gap-y-3">
              {informationAboutOthers.map((item: any, index: number) => {
                return (
                  <div key={index} className="w-full text-start">
                    <div>
                      {item.initial}.{" "}
                      <span className="font-bold">{item.title}</span>:{" "}
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/*  4. Communications */}
          <div className="p-4 flex flex-col gap-y-4">
            <h1 className="text-start text-2xl ">4. Communications</h1>

            <div className="flex flex-col items-start justify-start gap-y-3">
              {communications.map((item: any, index: number) => {
                return (
                  <div key={index} className="w-full text-start">
                    <div>
                      {item.initial}.{" "}
                      <span className="font-bold">{item.title}</span>:{" "}
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 5. Data Retention: */}
          <div className="p-4 flex flex-col gap-y-4 text-start">
            <h1 className="text-start text-2xl ">5. Data Retention:</h1>
            <p>
              We retain personal information for as long as necessary for the
              purposes outlined in this policy, or as required by law, including
              to:
            </p>

            <div className="flex flex-col items-start justify-start ">
              {dataRetention.map((item: any, index: number) => {
                return (
                  <ul className="list-disc list-inside">
                    <li key={index}>{item}</li>
                  </ul>
                );
              })}
            </div>
          </div>
          {/* 7. Children’s Privacy */}
          <div className="p-4 flex flex-col gap-y-4 text-start">
            <h1 className="text-start text-2xl ">7. Children’s Privacy</h1>
            <p>
              Our services are intended for users aged 18 and older. We do not
              knowingly collect information from individuals under the age of
              18. If you are under 18, you are not permitted to use our
              services.
            </p>
          </div>
          {/* 8. Data Security */}
          <div className="p-4 flex flex-col gap-y-4 text-start">
            <h1 className="text-start text-2xl ">8. Data Security</h1>
            <p>
              We implement industry-standard security measures to protect your
              personal information. While we strive to ensure the safety of your
              data, no security system is impenetrable, and we cannot guarantee
              absolute security.
            </p>
          </div>
          {/* 9. Your Rights */}
          <div className="p-4 flex flex-col gap-y-4 text-start">
            <h1 className="text-start text-2xl ">9. Your Rights</h1>
            <p>
              You have the right to access, correct, update, or delete your
              personal information. You may also object to certain processing
              activities or opt out of marketing emails by clicking the
              "unsubscribe" link in our communications.
            </p>
          </div>
          {/* 10. Contact Us */}
          <div className="p-4 flex flex-col gap-y-4 text-start">
            <h1 className="text-start text-2xl ">10. Contact Us</h1>
            <p>
              For any questions or concerns regarding this Privacy Policy,
              please contact us:
            </p>
            <p>Email: privacyofficer@sserves.com </p>
            <p>
              Mailing Address: 1420 Kingston Road, Scarborough, Toronto, ON, M1N
              1R3 
            </p>
          </div>
          {/* 11. Changes to This Policy */}
          <div className="p-4 flex flex-col gap-y-4 text-start">
            <h1 className="text-start text-2xl ">11. Changes to This Policy</h1>
            <p>
              We may update this Privacy Policy periodically. Any significant
              changes will be communicated to you via email or through a notice
              on our website, and the updated policy will be posted here with
              the revised effective date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
