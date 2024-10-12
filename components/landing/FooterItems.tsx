import React from "react";

const FooterItems = () => {
  const footerSections = [
    {
      title: "Join",
      items: ["Artisans", "Vendors", "Shoppers"],
    },
    {
      title: "Services",
      items: [
        "Beauty & Fashion",
        "Event Services",
        "Mechanical & Technical Services",
        "Custom Crafting",
        "Cultural & Educational Services",
        "Home Services/Improvement",
      ],
    },
    {
      title: "Products",
      items: [
        "Cuisines",
        "Fashion and textiles",
        "Home Decor",
        "Art and craft",
        "Jewelry and accessories",
        "Herbal & wellness products",
      ],
    },
    {
      title: "About Us",
      items: ["SphereServes Inc", "Policies", "ShereServes blog"],
    },
    {
      title: "Help",
      items: ["Help Center", "Privacy Policy", "Contact Us"],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-44">
      {footerSections.map((section, index) => (
        <div key={index}>
          <h3 className="font-bold text-lg text-[#502266] mb-4">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#502266] transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterItems;
