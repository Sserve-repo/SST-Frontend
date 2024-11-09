"use client";

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
import { categories } from "./Collections";
import { useFormContext } from "react-hook-form"; 

type CertificatePreviews = {
  [key: string]: string | null;
};

// Component props type
type ServiceCertificationsProps = {
  form: any;
  selectedCategory: string;
  selectedSubCategory: string;
  setDocumentList: any;
};

const ServiceCertifications: React.FC<ServiceCertificationsProps> = ({
  form,
  selectedCategory,
  selectedSubCategory,
  setDocumentList,
}) => {
  const { setValue } = useFormContext();
  const [certificatePreviews, setCertificatePreviews] =
    useState<CertificatePreviews>({});

  const catg = localStorage.getItem("category");
  const subCat = localStorage.getItem("subcategoy");

  if (!catg && !subCat) {
    localStorage.setItem("category", selectedCategory);
    localStorage.setItem("subcategoy", selectedSubCategory);
  }

  const getCertificationFields = () => {
    const category = categories.find(
      (cat) =>
        cat.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (catg && catg.toLowerCase())
    );
    const subCategory = category?.subCategory.find(
      (sub) =>
        sub.name.toLowerCase() === selectedSubCategory.toLowerCase() ||
        (subCat && subCat.toLowerCase())
    );
    return subCategory?.data || [];
  };

  const certificationFields = getCertificationFields();

  useEffect(() => {
    setCertificatePreviews({});
  }, [selectedCategory, selectedSubCategory]);

  return (
    <div className="flex flex-col gap-y-6">
      {certificationFields.map((field, index) => {
        const isOptional = field.description.toLowerCase().includes("optional");

        return (
          <FormField
            key={`document${index}`}
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
                      accept="application/pdf"
                      className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          onChange(file);
                          setValue(`document${index}`, file);
                          setDocumentList((prev) => [...prev, file]);
                          setCertificatePreviews((prev) => ({
                            ...prev,
                            [`preview${index}`]: URL.createObjectURL(file),
                          }));
                        } else {
                          onChange(null);
                          setValue(`document${index}`, null);
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
