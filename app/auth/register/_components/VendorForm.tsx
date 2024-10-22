"use client";

import React, { useState } from "react";
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
  city: string;
  postalCode: string;
  // Step 3: Set Up Your Shop Profile
  businessPhone: string;
  businessEmail: string;
  aboutShop: string;
  // Step 4: Verify Your Identity
  idType: string;
  idFront: File | null;
  idBack: File | null;
  // Step 5: Set Shipping & Return Policies
  shippingOption: string;
  deliveryFrom: string;
  deliveryTo: string;
  returnPolicy: string;
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
  stockLevels: string;
  shippingCosts: string;
  productDescription: string;
  productImage: File | null;
};

type VendorFormProps = {
  onBack: () => void;
};

export function VendorForm({ onBack }: VendorFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      businessPhone: "",
      businessEmail: "",
      aboutShop: "",
      idType: "",
      idFront: null,
      idBack: null,
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

    // Step 2: Set Your Shop Preferences validation
    if (step === 2) {
      if (!data.shopName) {
        errors.shopName = "Shop name is required";
        isValid = false;
      }
      if (!data.province) {
        errors.province = "Province is required";
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
    }

    // Step 3: Set Up Your Shop Profile validation
    if (step === 3) {
      if (!data.businessPhone) {
        errors.businessPhone = "Business phone number is required";
        isValid = false;
      } else if (data.businessPhone.length < 10) {
        errors.businessPhone = "Phone number must be at least 10 digits";
        isValid = false;
      }
      if (!data.businessEmail) {
        errors.businessEmail = "Business email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(data.businessEmail)) {
        errors.businessEmail = "Invalid business email";
        isValid = false;
      }
      if (!data.aboutShop) {
        errors.aboutShop = "About your shop is required";
        isValid = false;
      }
    }

    // Step 4: Verify Your Identity validation
    if (step === 4) {
      if (!data.idType) {
        errors.idType = "ID type is required";
        isValid = false;
      }
      if (!data.idFront) {
        errors.idFront = "Upload ID (FRONT) is required";
        isValid = false;
      }
      if (!data.idBack) {
        errors.idBack = "Upload ID (BACK) is required";
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
      if (!data.paymentOptions.length) {
        errors.paymentOptions = "At least one payment option must be selected";
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

    // Step 8: Tell Us About Your Listing validation
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

  const handleSubmit: SubmitHandler<FormData> = (data) => {
    const isValid = validateForm(data, step); // Pass the current step

    if (isValid) {
      if (step < 8) {
        handleNextStep();
      } else {
        console.log("Form submitted", data); // Final submission
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const stepTitles: string[] = [
    "Create Account",
    "Shop Preferences",
    "Shop Profile",
    "Identity Verification",
    "Shipping & Returns",
    "Payment Preferences",
    "Billing Setup",
    "Product Listing",
  ];

  return (
    <div className="max-w-2xl mx-auto w-full relative p-6">
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

        {/* <div className="ml-auto flex-col flex text-end">
          <span className="text-secondary text-sm">Step {step} of 8</span>
          <span>
            {
              [
                "Create Account",
                "Shop Preferences",
                "Shop Profile",
                "Identity Verification",
                "Shipping & Returns",
                "Payment Preferences",
                "Billing Setup",
                "Product Listing",
              ][step - 1]
            }
          </span>
        </div> */}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6  flex flex-col items-center justify-center"
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold w-full">
                Create Your Account
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 w-full">
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
                      <FormLabel className="text-gray-400">Last Name</FormLabel>
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
                    <FormLabel className="text-gray-400">
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
                      <FormLabel className="text-gray-400">Password</FormLabel>
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
                      <FormLabel className="text-gray-400">
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
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to terms & conditions</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold">
                Set Your Shop Preferences
              </h2>
              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">Shop Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl shadow-sm h-12 px-3"
                        placeholder="My Awesome Shop"
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
                    <FormLabel className="text-gray-400">Province</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ontario">Ontario</SelectItem>
                        <SelectItem value="quebec">Quebec</SelectItem>
                        <SelectItem value="british-columbia">
                          British Columbia
                        </SelectItem>
                        {/* Add more provinces as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">City/Town</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl shadow-sm h-12 px-3"
                        placeholder="Toronto"
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
                    <FormLabel className="text-gray-400">Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl shadow-sm h-12 px-3"
                        placeholder="A1A 1A1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold">
                Set Up Your Shop Profile
              </h2>
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Business Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl shadow-sm h-12 px-3"
                        placeholder="+1 (555) 123-4567"
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
                name="aboutShop"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      About Your Shop Service
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about your shop and what you offer..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold">Verify Your Identity</h2>
              <FormField
                control={form.control}
                name="idType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Identification Document
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="drivers-license">
                          Driver&apos;s License
                        </SelectItem>
                        <SelectItem value="national-id">National ID</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idFront"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Upload ID (FRONT)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        {...field}
                      />
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
              <FormField
                control={form.control}
                name="idBack"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Upload ID (BACK)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        {...field}
                      />
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
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-2xl font-semibold">
                Set Shipping & Return Policies
              </h2>
              <FormField
                control={form.control}
                name="shippingOption"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Shipping Options
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">
                          Standard Shipping
                        </SelectItem>
                        <SelectItem value="express">
                          Express Shipping
                        </SelectItem>
                        <SelectItem value="free">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deliveryFrom"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-400">
                        Estimated Delivery From
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl shadow-sm h-12 px-3"
                          type="date"
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
                      <FormLabel className="text-gray-400">
                        Estimated Delivery To
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl shadow-sm h-12 px-3"
                          type="date"
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
                    <FormLabel className="text-gray-400">
                      Return & Exchange Policy
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your return and exchange policy..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 6 && (
            <>
              <h2 className="text-2xl font-semibold">
                Set Up Payment Preferences
              </h2>
              <FormField
                control={form.control}
                name="paymentOptions"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Payment Options
                    </FormLabel>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="paymentOptions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
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
                              Pay with PayPal
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentOptions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
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
                              Pay with Stripe/Bank Account
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 7 && (
            <>
              <h2 className="text-2xl font-semibold">Set Up Billing</h2>
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
                      <FormLabel className="text-gray-400">CVC Code</FormLabel>
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
                        className="rounded-xl shadow-sm h-12 px-3"
                        placeholder="123 Main St, City, Country"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 8 && (
            <>
              <h2 className="text-2xl font-semibold">
                Tell Us About Your Listing
              </h2>
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Product Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        {/* Add more categories as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-400">
                      Product Title/Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl shadow-sm h-12 px-3"
                        placeholder="Awesome Product"
                      />
                    </FormControl>
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
                      <FormLabel className="text-gray-400">
                        Product Price
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
                      <FormLabel className="text-gray-400">
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
                    <FormLabel className="text-gray-400">
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
                    <FormLabel className="text-gray-400">
                      Product Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your product..."
                        className="min-h-[100px]"
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
                    <FormLabel className="text-gray-400">
                      Upload Product Image
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        {...field}
                      />
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
            </>
          )}

          <div className="py-2"></div>
          <Button type="submit" className="w-full max-w-sm rounded-xl h-12">
            {step === 8 ? "Submit" : "Save & Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
