import React from "react";

const FooterItems = () => {

  const footerSections = [
    {
      title: "Join",
      items: [
        { title: "Artisans", url: "/join/artisans" },
        { title: "Vendors", url: "/join/vendors" },
        { title: "Shoppers", url: "/join/shoppers" },
      ],
    },
    {
      title: "Services",
      items: [
        { title: "Beauty & Fashion", url: "/services/beauty-fashion" },
        { title: "Event Services", url: "/services/event" },
        {
          title: "Mechanical & Technical Services",
          url: "/services/mechanical-technical",
        },
        { title: "Custom Crafting", url: "/services/custom-crafting" },
        {
          title: "Cultural & Educational Services",
          url: "/services/cultural-educational",
        },
        {
          title: "Home Services/Improvement",
          url: "/services/home-improvement",
        },
      ],
    },
    {
      title: "Products",
      items: [
        { title: "Cuisines", url: "/products/cuisines" },
        { title: "Fashion and textiles", url: "/products/fashion-textiles" },
        { title: "Home Decor", url: "/products/home-decor" },
        { title: "Art and craft", url: "/products/art-craft" },
        {
          title: "Jewelry and accessories",
          url: "/products/jewelry-accessories",
        },
        {
          title: "Herbal & wellness products",
          url: "/products/herbal-wellness",
        },
      ],
    },
    {
      title: "About Us",
      items: [
        { title: "SphereServes Inc", url: "/about/sphere-serves-inc" },
        { title: "Policies", url: "/about/policies" },
        { title: "ShereServes blog", url: "/about/blog" },
      ],
    },
    {
      title: "Help",
      items: [
        { title: "Help Center", url: "/help/center" },
        { title: "Privacy Policy", url: "/help/privacy-policy" },
        { title: "Contact Us", url: "/help/contact-us" },
      ],
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
                  href={item.url}
                  className="text-gray-600 hover:text-[#502266] transition-colors duration-200"
                >
                  {item.title}
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
