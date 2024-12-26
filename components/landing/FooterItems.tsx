import React from "react";

const FooterItems = () => {
  const footerSections = [
    {
      title: "Join",
      items: [
        { title: "Artisans", url: "/auth/register?role=artisan&step=1" },
        { title: "Vendors", url: "/auth/register?role=vendor&step=1" },
        { title: "Shoppers", url: "/auth/register?role=buyer" },
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

// import { useEffect, useState } from "react";
// import { getProductMenu } from "@/actions/product";
// import { getServicesMenu } from "@/actions/service";

// const FooterItems = () => {
//   const [footerSections, setFooterSections] = useState([
//     {
//       title: "Join",
//       items: [
//         { title: "Artisans", url: "/auth/register?role=artisan&step=1" },
//         { title: "Vendors", url: "/auth/register?role=vendor&step=1" },
//         { title: "Shoppers", url: "/auth/register?role=buyer" },
//       ],
//     },
//     {
//       title: "Products",
//       items: [], // Placeholder for dynamically added products
//     },
//     {
//       title: "Services",
//       items: [], // Placeholder for dynamically added services
//     },
//     {
//       title: "About Us",
//       items: [
//         { title: "SphereServes Inc", url: "/about/sphere-serves-inc" },
//         { title: "Policies", url: "/about/policies" },
//         { title: "ShereServes blog", url: "/about/blog" },
//       ],
//     },
//     {
//       title: "Help",
//       items: [
//         { title: "Help Center", url: "/help/center" },
//         { title: "Privacy Policy", url: "/help/privacy-policy" },
//         { title: "Contact Us", url: "/help/contact-us" },
//       ],
//     },
//   ]);

//   useEffect(() => {
//     const handleFetchProductMenu = async () => {
//       const response = await getProductMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         const productCategories = data.data["Products Category Menu"].map(
//           (category) => ({
//             title: category.name,
//             items: category["product_category_items"].map((item) => ({
//               title: item.name,
//               url: `/products/?categoryId=${item.id}&categoryName=${item.name}`,
//             })),
//           })
//         );
//         return productCategories;
//       }
//       return [];
//     };

//     const handleFetchServicesMenu = async () => {
//       const response = await getServicesMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         const serviceCategories = data.data["Service Category Menu"].map(
//           (category) => ({
//             title: category.name,
//             items: category["service_category_items"].map((item) => ({
//               title: item.name,
//               url: `/services/?categoryId=${item.id}&categoryName=${item.name}`,
//             })),
//           })
//         );
//         return serviceCategories;
//       }
//       return [];
//     };

//     const updateFooterSections = async () => {
//       try {
//         const [products, services] = await Promise.all([
//           handleFetchProductMenu(),
//           handleFetchServicesMenu(),
//         ]);

//         setFooterSections((prevSections) =>
//           prevSections.map((section) => {
//             if (section.title === "Products") {
//               return { ...section, items: products };
//             }
//             if (section.title === "Services") {
//               return { ...section, items: services };
//             }
//             return section;
//           })
//         );
//       } catch (error) {
//         console.error("Failed to fetch footer data:", error);
//       }
//     };

//     updateFooterSections();
//   }, []);

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-44">
//       {footerSections.map((section, index) => (
//         <div key={index}>
//           <h3 className="font-bold text-lg text-[#502266] mb-4">
//             {section.title}
//           </h3>
//           <ul className="space-y-2">
//             {Array.isArray(section.items) &&
//               section.items.map((item, itemIndex) => (
//                 <li key={itemIndex} className="mb-4">
//                   <p className="font-bold text-[#502266] mb-2">{item.title}</p>
//                   {item && (
//                     <ul className="space-y-1">
//                       {item.map((subItem, subIndex) => (
//                         <li key={subIndex}>
//                           <a
//                             href={subItem.url}
//                             className="text-gray-600 hover:text-[#502266] transition-colors duration-200"
//                           >
//                             {subItem.title}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FooterItems;
