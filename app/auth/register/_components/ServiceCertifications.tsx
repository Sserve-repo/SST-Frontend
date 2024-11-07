import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";

// Define the types for our data structure
type CertificateData = {
  description: string;
  uploadText: string;
};

type SubCategory = {
  name: string;
  data: CertificateData[];
};

type Category = {
  category: string;
  subCategory: SubCategory[];
};

type CertificatePreviews = {
  [key: string]: string | null;
};

// Component props type
type ServiceCertificationsProps = {
  form: any;
  selectedCategory: string;
  selectedSubCategory: string;
};

// Categories data
const categories: Category[] = [
  {
    category: "Home Services/Improvement",
    subCategory: [
      {
        name: "Home Care",
        data: [
          {
            description:
              "Childcare certfication/First Aid Certification (Optional)",
            uploadText:
              "click to uplolad Childcare certfication/First Aid Certification",
          },
        ],
      },
      {
        name: "Landscaping",
        data: [
          {
            description: "Horticulture certification (Optional)",
            uploadText: "click to upload Horticulture certification",
          },
        ],
      },
      {
        name: "House Decoration",
        data: [
          {
            description: "Interior design certification (Optional)",
            uploadText: "click to upload Interior design certification",
          },
        ],
      },
      {
        name: "Construction",
        data: [
          {
            description: "Building permit",
            uploadText: "click to upload Building permit",
          },
          {
            description: "Contractor's license (Optional)",
            uploadText: "Click to Upload Contractor's license",
          },
        ],
      },
    ],
  },
  {
    category: "Beauty & Fashion",
    subCategory: [
      {
        name: "Salon Services",
        data: [
          {
            description: "Health and safety certifications",
            uploadText: "Click to upload Health and safety certifications",
          },
          {
            description: "Hairstylist license",
            uploadText: "Click to upload Hairstylist license",
          },
        ],
      },
      {
        name: "Fashion Design",
        data: [
          {
            description: "Fashion Design certifications (Optional)",
            uploadText: "Click to upload Fashion Design certifications",
          },
        ],
      },
      {
        name: "Makeup & Massage",
        data: [
          {
            description: "Health and safety certifications (Optional)",
            uploadText: "Click to upload Health and safety certifications",
          },
          {
            description: "Esthetician license (Optional)",
            uploadText: "Click to upload Esthetician license",
          },
        ],
      },
    ],
  },
  {
    category: "Event Services",
    subCategory: [
      {
        name: "Event Planning",
        data: [
          {
            description: "Special Event Permits",
            uploadText: "Click to upload Special Event Permits",
          },
          {
            description: "Event planning Certification",
            uploadText: "Click to upload Event planning Certification",
          },
        ],
      },
      {
        name: "Catering Services",
        data: [
          {
            description: "Health and safety certifications (Optional)",
            uploadText: "Click to Health and safety certifications",
          },
          {
            description: "Food handling permit",
            uploadText: "Click to Food handling permit",
          },
        ],
      },
    ],
  },
  {
    category: "Custom Crafting",
    subCategory: [
      {
        name: "Custom Handmade Crafting",
        data: [
          {
            description: "Artisan/Instructor  certification",
            uploadText: "Click to upload Artisan certification",
          },
        ],
      },

      {
        name: "Craft Workshops",
        data: [
          {
            description: "Artisan/Instructor  certification (Optional)",
            uploadText: "Click to upload Artisan certification",
          },
        ],
      },
    ],
  },
  {
    category: "Mechanical & Technical",
    subCategory: [
      {
        name: "Auto Mechanics",
        data: [
          {
            description: "Mechanic certification",
            uploadText: "Click to upload Mechanic certification",
          },
        ],
      },
      {
        name: "Detailing",
        data: [
          {
            description: "Detailing certification (Optional)",
            uploadText: "Click to upload Detailing certification",
          },
        ],
      },
      {
        name: "Technical (Handyman, Carpentry, Plumbing)",
        data: [
          {
            description: "Plumber's license",
            uploadText: "Click to upload Plumber's license",
          },
        ],
      },
      {
        name: "Electrical",
        data: [
          {
            description: "Electrician's license",
            uploadText: "Click to upload Electrician's license",
          },
        ],
      },
    ],
  },
  {
    category: "Cultural & Educational",
    subCategory: [
      {
        name: "Tour Guide Services",
        data: [
          {
            description: "Tour guide certification",
            uploadText: "Click to upload Tour guide certification",
          },
        ],
      },
      {
        name: "Photography & Videography",
        data: [
          {
            description: "Photography certification (Optional)",
            uploadText: "Click to upload Photography certification",
          },
        ],
      },
      {
        name: "Language Translation Services",
        data: [
          {
            description: "Translation certification (Optional)",
            uploadText: "Click to upload Translation certification",
          },
        ],
      },
    ],
  },
];

const ServiceCertifications: React.FC<ServiceCertificationsProps> = ({
  form,
  selectedCategory,
  selectedSubCategory,
}) => {
  console.log("cat stuff,", selectedCategory, selectedSubCategory);
  // Update state type to match CertificatePreviews
  const [certificatePreviews, setCertificatePreviews] =
    useState<CertificatePreviews>({});

  // Find the relevant certifications based on category and subcategory
  const getCertificationFields = () => {
    const category = categories.find(
      (cat) => cat.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    const subCategory = category?.subCategory.find(
      (sub) => sub.name.toLowerCase() === selectedSubCategory.toLowerCase()
    );
    return subCategory?.data || [];
  };

  const certificationFields = getCertificationFields();

  // Reset previews when category or subcategory changes
  useEffect(() => {
    setCertificatePreviews({});
  }, [selectedCategory, selectedSubCategory]);

  return (
    <div className="flex flex-col gap-y-6">
      {certificationFields.map((field, index) => {
        const isOptional = field.description.toLowerCase().includes("optional");

        return (
          <FormField
            key={`certification-${index}`}
            control={form.control}
            name={`document${index}`}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-400 mb-2">
                  {field.description.replace(" (Optional)", "")}
                  {isOptional && (
                    <span className="text-[#C28FDA]"> (Optional)</span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed relative border-gray-300 px-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                    {certificatePreviews[`preview${index}`] ? (
                      <div className="mt-4 flex flex-col items-center">
                        <img
                          src={certificatePreviews[`preview${index}`] || ""}
                          alt="Uploaded Preview"
                          className="w-fit h-24 object-cover rounded-lg"
                        />
                        <p className="mt-2 text-sm text-gray-600">
                          {value?.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="p-2 rounded-full flex items-center justify-center aspect-square mb-2">
                          <HiOutlineDocumentArrowUp className="w-10 h-8 text-primary" />
                        </div>
                        <p className="text-xs font-medium text-[#D3AFE4] mb-2">
                          <span className="text-primary">
                            {field.uploadText}
                          </span>
                        </p>
                      </>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                        if (file) {
                          setCertificatePreviews((prev) => ({
                            ...prev,
                            [`preview${index}`]: URL.createObjectURL(file),
                          }));
                        } else {
                          setCertificatePreviews((prev) => ({
                            ...prev,
                            [`preview${index}`]: null,
                          }));
                        }
                      }}
                      {...fieldProps}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
};

export default ServiceCertifications;
