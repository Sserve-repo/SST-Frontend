"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import "react-multi-date-picker/styles/colors/purple.css";
import InputIcon from "react-multi-date-picker/components/input_icon";
import ServiceCertifications from "./ServiceCertifications";
import MultiDatePicker from "./MultiDatePicker";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { Success } from "./Success";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  province: string;
  city: string;
  postalCode: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  yearsOfExperience: number;
  paymentOptions: string[];
  serviceCategory: string;
  serviceSubcategory: string;
  businessLocation: string;
  agreeToTerms: boolean;
  aboutProduct: string;
  productSubcategory: string;
  servicePrice: string;
  serviceName: string;
  serviceDescription: string;
  serviceImage: File | null;
  bookingDetails: string;
  cancellationAndRebookingPolicies: string;
  shopAddress: string;
  startTime: string;
  endTime: string;
  homeService: boolean;
  availableDays: string;

  // Step 7: Set Up Billing
  cardNumber: string;
  expiryDate: string;
  cvcCode: string;
  billingAddress: string;

  // Step 4: Verify Your Identity
  idType: string;
  businessLicense: File | null;
  proofOfInsurance: File | null;
  serviceCertificate: File | null;
};

type ArtisanFormProps = {
  onBack: () => void;
};

const categories = [
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
    category: "Event Service",
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
        name: "Catering Service",
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
  // {
  //   category: "Event Service",
  //   subCategory: [
  //     {
  //       name: "Event Planning",
  //       data: [
  //         {
  //           description: "Special Event Permits",
  //           uploadText: "Click to upload Special Event Permits",
  //         },
  //         {
  //           description: "Event planning Certification",
  //           uploadText: "Click to upload Event planning Certification",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Catering Services",
  //       data: [
  //         {
  //           description: "Health and safety certifications (Optional)",
  //           uploadText: "Click to Health and safety certifications",
  //         },
  //         {
  //           description: "Food Handling Permit",
  //           uploadText: "Click to upload Food Handling Permit",
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    category: "Custom Crafting",
    subCategory: [
      {
        name: "Custom Handmate Crafting",
        data: [
          {
            description: "Artisan certification",
            uploadText: "Click to upload Artisan certification",
          },
        ],
      },
      {
        name: "Catering Services",
        data: [
          {
            description: "Instructor certification (Optional)",
            uploadText: "Click to upload Instructor certification",
          },
        ],
      },
    ],
  },
  {
    category: "Mechanical & Technical Services",
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
        name: "Technical",
        data: [
          {
            description: "Plumber's license ",
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
    category: "Cultural & Educational Services",
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
        name: "Language Translation Service",
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

export function ArtisanForm({ onBack }: ArtisanFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serviceImages, setServiceImages] = useState<string | null>(null);
  const [businessLicensePreview, setbusinessLicensePreview] = useState<
    string | null
  >(null);
  const [proofOfInsurancePreview, setproofOfInsurancePreview] = useState<
    string | null
  >(null);
  const [serviceCertificatePreview, setServiceCertificatePreview] = useState<
    string | null
  >(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedDates, setSelectedDates] = useState<Value[] | undefined>(
    undefined
  );

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("***** dates:", selectedDates);
  };

  // // Date Picker States
  // const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // const handleSelect: SelectMultipleEventHandler = (days) => {
  //   setSelectedDates(days || []);
  // };

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      province: "",
      city: "",
      postalCode: "",
      email: "",
      password: "",
      cardNumber: "",
      expiryDate: "",
      cvcCode: "",
      billingAddress: "",
      serviceCategory: "",
      serviceSubcategory: "",
      confirmPassword: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      yearsOfExperience: 0,
      businessLocation: "",
      aboutProduct: "",
      servicePrice: "",
      serviceName: "",
      cancellationAndRebookingPolicies: "",
      shopAddress: "",
      availableDays: "",
      startTime: "",
      endTime: "",
      homeService: false,
      serviceDescription: "",
      bookingDetails: "",
      paymentOptions: [],
      agreeToTerms: false,
      serviceImage: null,
      businessLicense: null,
      proofOfInsurance: null,
      serviceCertificate: null,
      idType: "",
    },
  });

  const selectedCategory = form.watch("serviceCategory");
  useEffect(() => {
    form.setValue("serviceSubcategory", "");
  }, [selectedCategory, form]);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validateForm = (data: FormData): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof FormData, string>> = {};

    // Step 1 validation
    if (step === 1) {
      if (!data.firstName) {
        errors.firstName = "First name is required";
        isValid = false;
      }
      if (!data.lastName) {
        errors.lastName = "Last name is required";
        isValid = false;
      }
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Invalid email address";
        isValid = false;
      }
      if (!data.password || data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!data.province) {
        errors.province = "Province is required";
        isValid = false;
      }
      if (!data.serviceCategory) {
        errors.province = "Product Category is required";
        isValid = false;
      }
      if (!data.serviceSubcategory) {
        errors.province = "Product Category is required";
        isValid = false;
      }

      if (!data.city) {
        errors.city = "City/Town is required";
        isValid = false;
      }
      if (!data.postalCode) {
        errors.postalCode = "Postal code is required";
        isValid = false;
      }
      if (!data.businessPhone) {
        errors.businessPhone = "Business phone number is required";
        isValid = false;
      } else if (data.businessPhone.length < 10) {
        errors.businessPhone = "Phone number must be at least 10 digits";
        isValid = false;
      }
      if (!data.businessName) {
        errors.businessName = "Business name is required";
        isValid = false;
      }
      if (!data.businessEmail) {
        errors.businessEmail = "Business email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(data.businessEmail)) {
        errors.businessEmail = "Invalid business email";
        isValid = false;
      }
      if (!data.aboutProduct) {
        errors.aboutProduct = "About your shop is required";
        isValid = false;
      }
    }

    // Step 3 validation
    if (step === 3) {
      // if (data.yearsOfExperience < 0) {
      //   errors.yearsOfExperience = "Years of experience must be at least 0";
      //   isValid = false;
      // }
      // if (!data.serviceCategory) {
      //   errors.serviceCategory = "Service category is required";
      //   isValid = false;
      // }
      // if (!data.businessLocation) {
      //   errors.businessLocation = "Business location is required";
      //   isValid = false;
      // }
      // if (!data.agreeToTerms) {
      //   errors.agreeToTerms = "You must agree to the terms and conditions";
      //   isValid = false;
      // }
    }

    // Step 8: Tell Us About Your Listing validation
    if (step === 8) {
      if (!data.serviceName) {
        errors.serviceName = "Service name is required";
        isValid = false;
      }
      if (!data.servicePrice) {
        errors.servicePrice = "Service price is required";
        isValid = false;
      }

      if (!data.serviceDescription) {
        errors.serviceDescription = "Service description is required";
        isValid = false;
      }
      if (!data.serviceImage) {
        errors.serviceImage = "Service image upload is required";
        isValid = false;
      }
    }

    // Set errors
    Object.keys(errors).forEach((key) => {
      form.setError(key as keyof FormData, {
        type: "manual",
        message: errors[key as keyof FormData],
      });
    });

    return isValid;
  };

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    const isValid = validateForm(data);

    if (isValid) {
      if (step < 8) {
        handleNextStep(); // Move to the next step
      } else {
        console.log("Form submitted", data); // Final submission
        setSuccess(true);
        setEmail(data.email);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const stepTitles: string[] = [
    "Create Account",
    "Customize Business Profile",
    "Set Service Areas & Availability",
    "Verify Your Identity",
    "Business Service Policies",
    "Set Up Payment Preferences",
    "Set Up Billing",
    "Tell Us About Your Listing",
  ];

  return (
    <div className="max-w-lg mx-auto w-full relative">
      {!success ? (
        <>
          <div className="flex items-start mb-14 mt-3 text-[#C28FDA]">
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={step === 1 ? onBack : handlePreviousStep}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </div>
            <div className="ml-auto flex-col flex text-end">
              <span className="text-[#FFB46A] text-sm">
                Step {step} of {stepTitles.length}
              </span>{" "}
              <span className="text-[#C28FDA]">{stepTitles[step - 1]} </span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 flex flex-col items-center justify-center"
            >
              {step === 1 && (
                <>
                  <div className="flex items-center sm:flex-row flex-col w-full gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="John"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="Doe"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="johndoe@email.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center sm:flex-row flex-col w-full gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="******"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="******"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <div className=" w-full flex flex-col gap-y-2">
                  <h2 className="text-3xl font-semibold text-[#502266]">
                    Customize Business Profile{" "}
                  </h2>
                  <p className="text-gray-400 text-start">
                    Tell us about the services you offer: What makes your
                    business stand out?
                  </p>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Business Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            type="text"
                            placeholder="My Awesome Business"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessPhone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Business Phone Number
                        </FormLabel>
                        <FormControl className="w-full">
                          <PhoneInput
                            {...field}
                            country={"us"}
                            enableSearch={true}
                            inputStyle={{
                              width: "100%",
                              borderRadius: "12px",
                              border: "1px solid #e5e7eb",
                              boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                              height: "48px",
                              padding: "0 64px",
                            }}
                            containerStyle={{
                              width: "100%",
                            }}
                            buttonStyle={{
                              padding: "8px",
                              backgroundColor: "#f9fafb",
                              border: "1px solid #e5e7eb",
                              borderRadius: "12px 0px 0px 12px",
                            }}
                            dropdownStyle={{
                              zIndex: 50,
                            }}
                            placeholder="+1 (555) 123-4567"
                            inputProps={{
                              name: "businessPhone",
                              required: true,
                              autoFocus: true,
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Business Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            type="email"
                            placeholder="business@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceCategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Service Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={cat.category}
                                >
                                  {cat.category}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceSubcategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Service Sub Category *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                              <SelectValue placeholder="Please Select" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {categories
                              .find((cat) => cat.category === selectedCategory)
                              ?.subCategory.map((subCat, index) => (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={subCat.name}
                                >
                                  {subCat.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aboutProduct"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Tell us more about your services*
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[140px] rounded-xl shadow-sm px-3"
                            placeholder="Type here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          City/Town*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            type="text"
                            placeholder="Some city here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="--- ---"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Province
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                              <SelectValue placeholder="Select a province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="ontario"
                            >
                              Ontario
                            </SelectItem>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="quebec"
                            >
                              Quebec
                            </SelectItem>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="british-columbia"
                            >
                              British Columbia
                            </SelectItem>
                            {/* Add more provinces as needed */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="w-full flex flex-col  gap-y-3">
                  <h2 className="text-2xl font-semibold">
                    Set Service Areas & Availability
                  </h2>
                  <p className="text-gray-400 text-start">
                    Specify the areas and times you&apos;re available to provide
                    services.
                  </p>

                  <FormField
                    control={form.control}
                    name="availableDays"
                    render={({}) => (
                      <FormItem className="w-full flex  flex-col">
                        <FormLabel className="text-gray-400">
                          Select Days*
                        </FormLabel>
                        {/* <MultiDatePicker
                          selectedDates={selectedDates}
                          onSelect={handleSelect}
                        /> */}

                        <DatePicker
                          render={
                            <InputIcon className="w-full px-2 rounded-xl  ring-1 ring-slate-400 py-3 inline-flex justify-center items-center shadow-sm " />
                          }
                          multiple
                          value={selectedDates}
                          onChange={(dates) => {
                            handleDateChange(dates);
                          }}
                          className="purple"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            Select Start Time*
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="MM/YY"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            Select End Time*
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="MM/YY"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shopAddress"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Enter Shop Address*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="123 Rue Sainte-Catherine Ouest, Montréal, QC H3G 1P, Canada"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="homeService"
                    render={({ field }) => (
                      <FormItem className="flex flex-col  items-start space-3 px-6 py-5 rounded-2xl">
                        <FormLabel className="text-gray-400">
                          Are you available for home service?*
                        </FormLabel>

                        <div>
                          <FormControl>
                            <Checkbox
                              checked={field.value === true}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                              }}
                            />
                          </FormControl>

                          <FormLabel className="font-normal ml-3">
                            Yes, I offer home services{" "}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-y-3  w-full">
                  <h2 className="text-2xl font-semibold">
                    Verify Your Identity
                  </h2>
                  <p className="text-gray-400 text-start ">
                    Please upload 3-4 relevant certifications based on your
                    service type.
                    <span className="text-[#502266]">
                      Only required fields are marked with an asterisk (*).
                    </span>
                  </p>

                  <p className="text-[#B9B9B9] font-medium text-xl mt-5">
                    Basic Business Certifications
                  </p>

                  <FormField
                    control={form.control}
                    name="businessLicense"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400 mb-2">
                          Business License *
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed relative border-gray-300 px-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                            {/* Display preview and file name */}
                            {businessLicensePreview ? (
                              <div className="mt-4 flex flex-col items-center">
                                <img
                                  src={businessLicensePreview}
                                  alt="Uploaded Preview"
                                  className="w-fit h-24 object-cover rounded-lg"
                                />
                                <p className="mt-2 text-sm text-gray-600">
                                  {value?.name}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="p-2 rounded-full flex items-center justify-centeraspect-square mb-2">
                                  <HiOutlineDocumentArrowUp className="w-10 h-8 text-primary" />
                                </div>
                                <p className="text-xs font-medium text-[#D3AFE4] mb-2">
                                  <span className="text-primary ">
                                    Click to Upload Business License
                                  </span>
                                </p>
                              </>
                            )}
                            {/* Hidden Input for File */}
                            <Input
                              type="file"
                              accept="image/*"
                              className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                onChange(file); // Pass the file to form state
                                if (file) {
                                  setbusinessLicensePreview(
                                    URL.createObjectURL(file)
                                  ); // Set IdFrontPreview image
                                } else {
                                  setbusinessLicensePreview(null);
                                }
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Proof of Insurance (Optional) */}
                  <FormField
                    control={form.control}
                    name="proofOfInsurance"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="w-full mt-6">
                        <FormLabel className="text-gray-400 mb-2">
                          Proof of Insurance (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed relative border-gray-300 px-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                            {/* Display preview and file name */}
                            {proofOfInsurancePreview ? (
                              <div className="mt-4 flex flex-col items-center">
                                <img
                                  src={proofOfInsurancePreview}
                                  alt="Uploaded Preview"
                                  className="w-fit h-24 object-cover rounded-lg"
                                />
                                <p className="mt-2 text-sm text-gray-600">
                                  {value?.name}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="p-2 rounded-full flex items-center justify-centeraspect-square mb-2">
                                  <HiOutlineDocumentArrowUp className="w-10 h-8 text-primary" />
                                </div>
                                <p className="text-xs font-medium text-[#D3AFE4] mb-2">
                                  <span className="text-primary ">
                                    Click to Upload Proof of Insurance
                                  </span>
                                </p>
                              </>
                            )}
                            {/* Hidden Input for File */}
                            <Input
                              type="file"
                              accept="image/*"
                              className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                onChange(file); // Pass the file to form state
                                if (file) {
                                  setproofOfInsurancePreview(
                                    URL.createObjectURL(file)
                                  ); // Set IdBackPreview image
                                } else {
                                  setproofOfInsurancePreview(null);
                                }
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-gray-400 font-medium text-xl mt-10 text-start ">
                    Service-Specific Certifications *
                  </p>

                  <ServiceCertifications
                    form={form}
                    selectedCategory={form.watch("serviceCategory")}
                    selectedSubCategory={form.watch("serviceSubcategory")}
                  />
                </div>
              )}

              {step === 5 && (
                <div className="w-full flex flex-col gap-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Business Service Policies
                    </h2>
                    <p className="text-gray-400 text-start">
                      Outline your service booking, cancellation, and rebooking
                      policies.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="bookingDetails"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Booking Details *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[140px] rounded-xl shadow-sm h-12 px-3"
                            placeholder="Enter details of booking here"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cancellationAndRebookingPolicies"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Define Cancellation and Rebooking Policies *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[140px] rounded-xl shadow-sm h-12 px-3"
                            placeholder="Type here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link href="/" className="text-[#9E4FC4]">
                    *Please, ensure your terms & policies meet our standard
                  </Link>
                </div>
              )}

              {step === 6 && (
                <div className=" flex flex-col w-full gap-y-3">
                  <div>
                    <div className="text-[#502266] text-3xl font-semibold">
                      <p> Set Up Payment </p>
                      <p>Preferences</p>
                    </div>
                    <p className="text-gray-400 text-start">
                      Your payment details will be securely stored and verified.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="paymentOptions"
                    render={() => (
                      <FormItem className="w-full ">
                        <FormLabel className="text-gray-400"></FormLabel>
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="paymentOptions"
                            render={({ field }) => (
                              <FormItem className=" border h-[6rem] flex items-center space-x-3 space-y-0 px-6 py-5 rounded-2xl bg-[#F7F0FA]">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("paypal")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "paypal"]
                                        : field.value?.filter(
                                            (value) => value !== "paypal"
                                          ) || [];
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <p className="font-semibold">
                                    {" "}
                                    Pay with Pay{" "}
                                    <span className="text-[#179BD7]">Pal</span>
                                  </p>
                                  <p className="text-[#B9B9B9]">
                                    Use your PayPal account for secure payments.
                                  </p>
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="paymentOptions"
                            render={({ field }) => (
                              <FormItem className="border  h-[6rem] flex items-center space-x-3 space-y-0 px-6 py-5 rounded-2xl bg-[#F7F0FA]">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("stripe")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "stripe"]
                                        : field.value?.filter(
                                            (value) => value !== "stripe"
                                          ) || [];
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <p className="font-semibold">
                                    Pay with{" "}
                                    <span className="text-[#179BD7]">
                                      Stripe
                                    </span>
                                    /Bank Account
                                  </p>
                                  <p className="text-[#B9B9B9]">
                                    Use your bank account or credit card via
                                    Stripe.{" "}
                                  </p>
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 7 && (
                <div className="flex flex-col w-full gap-y-4">
                  <h2 className="text-[#502266] text-2xl font-semibold">
                    Set Up Billing
                  </h2>
                  <div className="text-gray-400 text-start">
                    <p>We will securely store your billing fees.</p>
                    <p> details for future platform</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Credit Card Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="1234 5678 9012 3456"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            Expiry Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="MM/YY"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvcCode"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-400">
                            CVC Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="123"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Billing Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-14 px-3"
                            placeholder="123 Main St, City, Country"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 8 && (
                <div className="w-full">
                  <h2 className="text-2xl font-semibold">
                    Tell Us About Your Listing
                  </h2>
                  <p className="text-gray-400 text-start">
                    You can add up to 5 categories and customize each listing to
                    match.
                  </p>
                  <FormField
                    control={form.control}
                    name="serviceName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Service Title/Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="Enter name of Product"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="servicePrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Service Price *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            type="number"
                            placeholder="99.99"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceDescription"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Service Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] rounded-xl shadow-sm px-3"
                            placeholder="Describe your service..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceImage"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-400">
                          Upload Service Image
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed relative border-gray-300 p-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                            {/* Display preview and file name */}
                            {serviceImages ? (
                              <div className="mt-4 flex flex-col items-center">
                                <img
                                  src={serviceImages}
                                  alt="Uploaded Preview"
                                  className="w-fit h-24 object-cover rounded-lg"
                                />
                                <p className="mt-2 text-sm text-gray-600">
                                  {value?.name}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="p-4 rounded-full flex items-center justify-center bg-slate-200 aspect-square mb-2">
                                  <HiOutlineDocumentArrowUp className="w-10 h-auto text-primary" />
                                </div>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                  <span className="text-primary ">
                                    Click to Upload,{" "}
                                  </span>{" "}
                                  or drag and drop.
                                </p>
                                <p className="text-sm font-medium italic text-gray-600 mb-2">
                                  (Max. File size: 25 MB)
                                </p>
                              </>
                            )}
                            {/* Hidden Input for File */}
                            <Input
                              type="file"
                              accept="image/*"
                              className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                onChange(file); // Pass the file to form state
                                if (file) {
                                  setServiceImages(URL.createObjectURL(file));
                                } else {
                                  setServiceImages(null);
                                }
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        {value && value.name && (
                          <p className="mt-2 text-sm text-gray-600">
                            Uploaded File: {value.name}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="py-2"></div>
              <Button type="submit" className="w-full max-w-sm rounded-xl h-12">
                {step === 1
                  ? "Register"
                  : step === 4
                  ? "Submit Documents & Continue"
                  : step === 8
                  ? "Submit"
                  : "Save & Continue"}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <div>
          <Success email={email} />
        </div>
      )}
    </div>
  );
}
