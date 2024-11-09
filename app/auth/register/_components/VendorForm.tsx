"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import Link from "next/link";
import { Success } from "./Success";
import {
  billingPayload,
  businessProfilePayload,
  paymentPreferencePayload,
  productListingPayload,
  shippingPolicyPayload,
  userRegistrationPayload,
  vendorIdentityPayload,
} from "@/forms/vendors";
import { registerUser } from "@/fetchers/auth";
import { toast } from "sonner";
import { formatErrors } from "@/config/utils";
import {
  createBilling,
  createBusinessProfile,
  createPaymentPreference,
  createProductListing,
  createShippingPolicy,
  createVendorIdentity,
  creatOtp,
  getProductCategories,
  getProductCategoryItemsById,
  getProductRegions,
} from "@/fetchers/vendors";
import { CanadianProvinces } from "./Collections";
import { OtpForm } from "./OtpForm";
import { otpPayload } from "@/forms/artisans";

type FormData = {
  // Step 1: Create Account
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  // Step 2: Set Your Shop Preferences
  shopName: string;
  province: string;
  aboutProduct: string;
  productSubcategory: string;
  productRegion: string;
  city: string;
  postalCode: string;
  // Step 3: Set Up Your Shop Profile
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  aboutShop: string;
  // Step 4: Verify Your Identity
  idType: string;
  document: File | null;
  // Step 5: Set Shipping & Return Policies
  shippingOption: string;
  deliveryFrom: string;
  deliveryTo: string;
  returnPolicy: string;

  bankName: string;
  accountNumber: string;
  institutionNumber: string;
  transitNumber: string;

  // Step 6: Set Up Payment Preferences
  paymentOptions: string[];
  // Step 7: Set Up Billing
  cardNumber: string;
  expiryDate: string;
  cvcCode: string;
  billingAddress: string;
  // Step 8: Tell Us About Your Listing
  productCategory: string;
  productName: string;
  productPrice: string;
  otp: string;
  stockLevels: string;
  shippingCosts: string;
  productDescription: string;
  productImage: File | null;
};

type ProductCategory = {
  id: string;
  name: string;
};

type ProductRegion = {
  id: string;
  name: string;
};

type VendorFormProps = {
  onBack: () => void;
  registrationStep: number;
};

export function VendorForm({ onBack, registrationStep }: VendorFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string | null>(null);
  const [productRegion, setProductRegion] = useState<ProductRegion[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [productCategoryItems, setProductCategoryItems] = useState<
    ProductCategory[]
  >([]);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      shopName: "",
      province: "",
      city: "",
      postalCode: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      aboutShop: "",
      otp: "",
      productRegion: "",
      idType: "",
      document: null,
      shippingOption: "",
      deliveryFrom: "",
      deliveryTo: "",
      returnPolicy: "",
      paymentOptions: [],
      cardNumber: "",
      expiryDate: "",
      cvcCode: "",
      billingAddress: "",
      productCategory: "",
      productName: "",
      productPrice: "",
      stockLevels: "",
      shippingCosts: "",
      productDescription: "",
      productImage: null,
      bankName: "",
      accountNumber: "",
      institutionNumber: "",
      transitNumber: "",
    },
  });

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validateForm = (data: FormData, step: number): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof FormData, string>> = {};

    // Step 1: Create Account validation
    if (step === 1) {
      if (!data.firstName) {
        errors.firstName = "First name is required";
        isValid = false;
      }
      if (!data.lastName) {
        errors.lastName = "Last name is required";
        isValid = false;
      }
      if (!data.email) {
        errors.email = "Email address is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Invalid email address";
        isValid = false;
      }
      if (!data.password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (!data.confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
        isValid = false;
      } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
      if (!data.agreeToTerms) {
        errors.agreeToTerms = "You must agree to the terms and conditions";
        isValid = false;
      }
    }

    // Step 2 validation
    if (step === 2) {
      data.otp = otp;
      if (!data.otp) {
        errors.otp = "otp is required";
        isValid = false;
      }
    }

    // Step 3: Set Your Shop Preferences validation
    if (step === 3) {
      if (!data.province) {
        errors.province = "Province is required";
        isValid = false;
      }
      if (!data.productCategory) {
        errors.province = "Product Category is required";
        isValid = false;
      }
      if (!data.productRegion) {
        errors.province = "Product Region is required";
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

    // Step 4: Verify Your Identity validation
    if (step === 4) {
      if (!data.idType) {
        errors.idType = "ID type is required";
        isValid = false;
      }
      if (!data.document) {
        errors.document = "Upload ID is required";
        isValid = false;
      }
    }

    // Step 5: Set Shipping & Return Policies validation
    if (step === 5) {
      if (!data.shippingOption) {
        errors.shippingOption = "Shipping option is required";
        isValid = false;
      }
      if (!data.deliveryFrom) {
        errors.deliveryFrom = "Estimated delivery start date is required";
        isValid = false;
      }
      if (!data.deliveryTo) {
        errors.deliveryTo = "Estimated delivery end date is required";
        isValid = false;
      }
      if (!data.returnPolicy) {
        errors.returnPolicy = "Return and exchange policy is required";
        isValid = false;
      }
    }

    // Step 6: Set Up Payment Preferences validation
    if (step === 6) {
      if (!data.bankName) {
        errors.bankName = "Bank Name is required";
        isValid = false;
      }
      if (!data.accountNumber) {
        errors.accountNumber = "Account Number is required";
        isValid = false;
      }
      if (!data.institutionNumber) {
        errors.institutionNumber = "Institution Number is required";
        isValid = false;
      }
      if (!data.transitNumber) {
        errors.transitNumber = "Transit Number is required";
        isValid = false;
      }
    }

    // Step 7: Set Up Billing validation
    if (step === 7) {
      if (!data.cardNumber) {
        errors.cardNumber = "Credit card number is required";
        isValid = false;
      }
      if (!data.expiryDate) {
        errors.expiryDate = "Expiry date is required";
        isValid = false;
      }
      if (!data.cvcCode) {
        errors.cvcCode = "CVC code is required";
        isValid = false;
      }
      if (!data.billingAddress) {
        errors.billingAddress = "Billing address is required";
        isValid = false;
      }
    }

    // Step8: Tell Us About Your Listing validation
    if (step === 8) {
      if (!data.productCategory) {
        errors.productCategory = "Product category is required";
        isValid = false;
      }
      if (!data.productName) {
        errors.productName = "Product name is required";
        isValid = false;
      }
      if (!data.productPrice) {
        errors.productPrice = "Product price is required";
        isValid = false;
      }
      if (!data.stockLevels) {
        errors.stockLevels = "Stock levels are required";
        isValid = false;
      }
      if (!data.shippingCosts) {
        errors.shippingCosts = "Shipping costs are required";
        isValid = false;
      }
      if (!data.productDescription) {
        errors.productDescription = "Product description is required";
        isValid = false;
      }
      if (!data.productImage) {
        errors.productImage = "Product image upload is required";
        isValid = false;
      }
    }

    // Set errors in the form
    Object.keys(errors).forEach((key) => {
      form.setError(key as keyof FormData, {
        type: "manual",
        message: errors[key as keyof FormData],
      });
    });

    return isValid;
  };

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    const isValid = validateForm(data, step);

    if (isValid) {
      if (step === 1) {
        const payload = userRegistrationPayload(data);
        const response = await registerUser("vendor", payload);
        if (response) {
          const res = await response.json();
          console.log("Form submitted", res);

          if (response.ok && response.status === 201) {
            toast.success(res.message);
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 2) {
        const payload = otpPayload(data);
        const response = await creatOtp(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 200) {
            toast.success(res.message);
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 3) {
        const payload = businessProfilePayload(data);
        const response = await createBusinessProfile(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 201) {
            toast.success(res.message);
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 4) {
        const payload = vendorIdentityPayload(data);
        const response = await createVendorIdentity(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 201) {
            toast.success(res.message);
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 5) {
        const payload = shippingPolicyPayload(data);
        const response = await createShippingPolicy(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 201) {
            toast.success(res.message);
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 6) {
        const payload = paymentPreferencePayload(data);
        const response = await createPaymentPreference(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 201) {
            toast.success(res.message);
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 7) {
        const payload = billingPayload(data);
        const response = await createBilling(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 200) {
            toast.success("Billing Created Successfully");
            handleNextStep();
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }

      if (step === 8) {
        const payload = productListingPayload(data);
        const response = await createProductListing(payload);
        if (response) {
          const res = await response.json();

          if (response.ok && response.status === 201) {
            toast.success(res.message);
            setEmail(data.email);
            setSuccess(true);
          } else {
            formatErrors(res.data.errors, res);
          }
        }
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const stepTitles: string[] = [
    "Create Account",
    "Confirm Otp",
    "Shop Preferences",
    "Identity Verification",
    "Shipping & Returns",
    "Payment Preferences",
    "Billing Setup",
    "Product Listing",
  ];

  const getProductCat = async () => {
    const data = await getProductCategories();
    setProductCategories(data.data["Products Category"]);
  };

  const getProductRegion = async () => {
    const data = await getProductRegions();
    setProductRegion(data.data["Products Region"]);
  };

  const handlefetchProductCatItems = async (catId) => {
    const data = await getProductCategoryItemsById(catId);
    setProductCategoryItems(data.data["Products Category Item By ID"]);
  };

  useEffect(() => {
    getProductCat();
    getProductRegion();

    if (registrationStep) {
      setStep(registrationStep);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full relative p-6">
      {!success ? (
        <>
          <div className="flex items-start mb-6 text-primary">
            <div
              className="flex items-center gap-1 cursor-pointer mb-14 mt-3 text-[#C28FDA]"
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
              className="space-y-6  flex flex-col items-center justify-center"
            >
              {step === 1 && (
                <>
                  <div>
                    <div className="flex justify-center flex-col max-w-md mb-[30px] w-full">
                      <h2 className="text-[40px] font-semibold text-[#502266] w-full">
                        Create Account
                      </h2>
                      <p className="text-lg font-normal text-[#b9b9b9] mb-[10px] md:pr-[290px]">
                        For the purpose of industry regulation, your details are
                        required.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#502266] text-base font-normal">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John"
                              className="rounded-xl shadow-sm h-12 px-3"
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
                          <FormLabel className="text-[#502266] text-base font-normal">
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
                        <FormLabel className="text-[#502266] text-base font-normal">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john@example.com"
                            className="rounded-xl shadow-sm h-12 px-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#502266] text-base font-normal">
                            Create Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                className="rounded-xl shadow-sm h-12 px-3"
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
                          <FormLabel className="text-[#502266] text-base font-normal">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                className="rounded-xl shadow-sm h-12 px-3"
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
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center self-start gap-[14px] mt-4">
                          <FormLabel>
                            <p className="font-normal text-base text-[#9E4FC4]">
                              I agree to the &nbsp;
                              <span className="text-[#240F2E] hover:underline">
                                <a href="#">Terms of Use</a>
                              </span>
                              &nbsp; and &nbsp;
                              <span className="text-[#240F2E] hover:underline">
                                <a href="#">Privacy Policy</a>
                              </span>
                            </p>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div className=" w-full flex flex-col gap-y-2 mb-[20px]">
                    <div className="flex items-center sm:flex-row flex-col w-full gap-3">
                      <OtpForm form={form} setOtp={setOtp} />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className=" w-full flex flex-col gap-y-[30px]">
                  <div>
                    <h2 className="text-[40px] font-semibold text-[#502266] leading-[50px]">
                      <p>Set Your Shop Profile </p>& Preferences
                    </h2>
                    <div className="text-lg font-normal text-[#b9b9b9] md:pr-[290px]">
                      <p> For the purpose of industry regulation,</p>
                      <p> your details are required.</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266] font-normal text-base">
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
                        <FormLabel className="text-[#502266] font-normal text-base">
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
                        <FormLabel className="text-[#502266] font-normal text-base">
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
                    name="productCategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266] font-normal text-base">
                          Product Category*
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
                            {productCategories.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={item.id}
                                >
                                  {item.name}
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
                    name="productRegion"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266] font-normal text-base">
                          Product Region*
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
                            {productRegion.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={item.id}
                                >
                                  {item.name}
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
                    name="aboutProduct"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266] font-normal text-base">
                          Tell us more about your products*
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] rounded-xl shadow-sm px-3"
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
                        <FormLabel className="text-[#502266] font-normal text-base">
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
                        <FormLabel className="text-[#502266] font-normal text-base">
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
                        <FormLabel className="text-[#502266] font-normal text-base">
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
                            {CanadianProvinces.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={item}
                                >
                                  {item}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="w-full space-y-7">
                  <div>
                    <h2 className="text-[40px] font-semibold text-[#502266]">
                      Verify Your Identity
                    </h2>
                    <p className="text-lg font-normal text-[#b9b9b9] mb-[10px] md:pr-[70px]">
                      To verify your business, please upload 3-4 relevant
                      certifications. Some certifications are required, while
                      others are optional. This helps build trust and
                      credibility with your clients.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="idType"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Upload Identification Document
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="passport"
                            >
                              Passport
                            </SelectItem>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="drivers-license"
                            >
                              Driver&apos;s License
                            </SelectItem>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="national-id"
                            >
                              National ID
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Upload ID
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed relative border-gray-300 p-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                            {/* Display preview and file name */}
                            {document ? (
                              <div className="mt-4 flex flex-col items-center">
                                <img
                                  src={document}
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
                              accept="pdf/*"
                              className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                onChange(file); // Pass the file to form state
                                if (file) {
                                  setDocument(URL.createObjectURL(file));
                                } else {
                                  setDocument(null);
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
                </div>
              )}

              {step === 5 && (
                <div className="w-full flex flex-col gap-y-7">
                  <div>
                    <div className="text-[40px] font-semibold text-[#502266] md:pr-[200px] leading-[50px]">
                      <p>Set Shipping & Return Policies</p>
                    </div>
                    <p className="text-lg font-normal text-[#b9b9b9] md:pr-[290px]">
                      Provide clear details about your shipping methods and
                      return policies.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="shippingOption"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Shipping Options
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="standard"
                            >
                              Standard Shipping
                            </SelectItem>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="express"
                            >
                              Express Shipping
                            </SelectItem>
                            <SelectItem
                              className="h-11 rounded-lg px-3"
                              value="free"
                            >
                              Free Shipping
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-[#b9b9b9] font-normal text-base">
                    Estimated Delivery Times:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="deliveryFrom"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
                            From:
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3 placeholder-gray-400"
                              type="date"
                              placeholder="DD/MM"
                              onFocus={(e) => {
                                e.target.type = "date"; // Show date picker on focus
                              }}
                              onBlur={(e) => {
                                if (!e.target.value) {
                                  e.target.type = "text"; // Revert to text if no date is selected
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryTo"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
                            To:
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3 placeholder-gray-400"
                              type="date"
                              placeholder="DD/MM"
                              onFocus={(e) => {
                                e.target.type = "date"; // Show date picker on focus
                              }}
                              onBlur={(e) => {
                                if (!e.target.value) {
                                  e.target.type = "text"; // Revert to text if no date is selected
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="returnPolicy"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Return & Exchange Policy
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[140px] rounded-xl shadow-sm px-3"
                            placeholder="Describe your return and exchange policy..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-1">
                    <p className="text-[#9E4FC4]">
                      *Please, ensure your terms & policies meet our{" "}
                    </p>
                    <Link href="/">standard</Link>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className=" flex flex-col w-full gap-y-7">
                  <div>
                    <div className="text-[40px] font-semibold text-[#502266] leading-[50px] md:pr-[100px]">
                      <p> Set Up Payment Preferences</p>
                    </div>
                    <p className="text-lg font-normal text-[#b9b9b9] md:pr-[290px]">
                      Your payment details will be securely stored and verified.
                    </p>
                  </div>
                  {/* <FormField
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
                  /> */}

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Bank Name*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="First Bank Nig Ltd."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Account Number*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="0123456789"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="institutionNumber"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
                            Institution Number*
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3 placeholder-gray-400"
                              type="text"
                              placeholder="123"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transitNumber"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
                            Transit Number*
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3 placeholder-gray-400"
                              type="text"
                              placeholder="12345"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="flex flex-col w-full gap-y-7">
                  <div>
                    <h2 className="text-[40px] font-semibold text-[#502266]">
                      Set Up Billing
                    </h2>
                    <div className="text-lg font-normal text-[#b9b9b9] md:pr-[290px]">
                      <p>We will securely store your billing fees.</p>
                      <p> details for future platform</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
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
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
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
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
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
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
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
                <div className="w-full space-y-7">
                  <div>
                    <h2 className="text-[40px] font-semibold text-[#502266]">
                      Tell Us About Your Listing
                    </h2>
                    <p className="text-lg font-normal text-[#b9b9b9] mb-[10px] md:pr-[200px]">
                      You can add up to 5 categories and customize each listing
                      to match.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Product Title/Name
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
                    name="productCategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266] font-normal text-base">
                          Product Category*
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handlefetchProductCatItems(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productCategories.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={item.id}
                                >
                                  {item.name}
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
                    name="productSubcategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266] font-normal text-base">
                          Product Sub Category*
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
                            {productCategoryItems.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  className="h-11 rounded-lg px-3"
                                  value={item.id}
                                >
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productPrice"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
                            Product Price *
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
                      name="stockLevels"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] font-normal text-base">
                            Stock Levels
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              type="number"
                              placeholder="100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="shippingCosts"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Shipping Costs
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-xl shadow-sm h-12 px-3"
                            type="number"
                            placeholder="10.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productDescription"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Product Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] rounded-xl shadow-sm px-3"
                            placeholder="Describe your product..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productImage"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#b9b9b9] font-normal text-base">
                          Upload Product Image
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed relative border-gray-300 p-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                            {/* Display preview and file name */}
                            {productImages ? (
                              <div className="mt-4 flex flex-col items-center">
                                <img
                                  src={productImages}
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
                                  setProductImages(URL.createObjectURL(file)); // Set Document image
                                } else {
                                  setProductImages(null);
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
                  : step === 3
                  ? "Submit Documents & Continue"
                  : step === 7
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
