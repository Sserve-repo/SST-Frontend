"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProductMenu } from "@/actions/product";
import { getServicesMenu } from "@/actions/service";

const FooterItems = () => {
  const [productsMenu, setProductsMenu] = useState<any[]>([]);
  const [servicesMenu, setServicesMenu] = useState<any[]>([]);

  const handleFetchProductMenu = async () => {
    const response = await getProductMenu();
    if (response && response.ok) {
      const data = await response.json();
      setProductsMenu(data.data["Products Category Menu"]);
    }
  };

  const handleFetchServicesMenu = async () => {
    const response = await getServicesMenu();
    if (response && response.ok) {
      const data = await response.json();
      setServicesMenu(data.data["Service Category Menu"]);
    }
  };

  useEffect(() => {
    handleFetchProductMenu();
    handleFetchServicesMenu();
  }, []);

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
      items: servicesMenu.map((service) => ({
        title: service.name,
        url: `/services/?categoryId=${service.id}&categoryName=${service.name}`,
      })),
    },
    {
      title: "Products",
      items: productsMenu.map((category) => ({
        title: category.name,
        url: `/products/?categoryId=${category.id}`,
      })),
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
                <Link
                  href={item.url}
                  className="text-gray-600 hover:text-[#502266] transition-colors duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterItems;
