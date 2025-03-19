"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import "react-multi-date-picker/styles/colors/purple.css";
import InputIcon from "react-multi-date-picker/components/input_icon";
import ServiceCertifications from "./ServiceCertifications";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

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
import { ArrowLeft, Clock10, Eye, EyeOff, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { Success } from "./Success";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import {
  billingPayload,
  businessProfilePayload,
  serviceAvailabilityPayload,
  paymentPreferencePayload,
  serviceListingPayload,
  userRegistrationPayload,
  artisanIdentityPayload,
  businessPolicyPayload,
  otpPayload,
} from "@/forms/artisans";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";
import { formatErrors } from "@/config/utils";
import {
  createBilling,
  createBusinessProfile,
  createServiceAvailability,
  createPaymentPreference,
  createServiceListing,
  createArtisanIdentity,
  createbusinessPolicy,
  getServiceCategories,
  getServiceCategoryItemsById,
  creatOtp,
} from "@/actions/artisans";
import { OtpForm } from "./OtpForm";
import { getProvinces } from "@/actions/provinces";
import { googleApiKey } from "@/config/constant";

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
  aboutService: string;
  document1: File | null;
  document2: File | null;
  productSubcategory: string;
  servicePrice: string;
  serviceDuration: string;
  serviceName: string;
  otp: string;
  serviceDescription: string;
  serviceImage: File | null;
  bookingDetails: string;
  cancellationPolicy: string;
  shopAddress: string;
  availableFrom: string;
  availableTo: string;
  homeService: boolean;
  availableDays: string;
  latitude: string;
  longitude: string;

  // Step 7: Set Up Billing
  cardNumber: string;
  expiryDate: string;
  cvcCode: string;
  billingAddress: string;

  bankName: string;
  accountNumber: string;
  institutionNumber: string;
  transitNumber: string;

  // Step 4: Verify Your Identity
  idType: string;
  businessLicense: File | null;
  proofOfInsurance: File | null;
  serviceCertificate: File | null;
};

type ProductCategory = {
  id: string;
  name: string;
};

type ArtisanFormProps = {
  onBack: () => void;
  registrationStep: number;
};

export function ArtisanForm({ onBack, registrationStep }: ArtisanFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [cordinates, setCordinates] = useState<{
    lat: string;
    lng: string;
  } | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serviceImages, setServiceImages] = useState<string | null>(null);
  const [businessLicensePreview, setbusinessLicensePreview] = useState<
    string | null
  >(null);
  const [proofOfInsurancePreview, setproofOfInsurancePreview] = useState<
    string | null
  >(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Value[] | undefined>(
    undefined
  );
  const [serviceCategories, setServiceCategories] = useState<ProductCategory[]>(
    []
  );
  const { setAuth } = useAuth();
  const [serviceCategoryItems, setServiceCategoryItems] = useState<
    ProductCategory[]
  >([]);
  const [provinces, setProvinces] = useState([]);
  const [userVerified, setUserVerified] = useState(false);
  const [completedUserRegistration, setCompletedUserRegistration] =
    useState(false);
  const [shopperAddress, setShopperAddress] = useState("");

  const [documentList, setDocumentList] = useState<File[] | null>([]);
  const [otp, setOtp] = useState("");
  const addressRef = useRef<any>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey!,
    libraries: ["places"],
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("Formatted Dates:", dates);
  };

  const handleOnPlacesChanged = async () => {
    const address = addressRef.current.getPlaces();
    if (address.length > 0) {
      const cordinates = await getAddressGeoCode(address[0].formatted_address);
      setCordinates(cordinates);
      setShopperAddress(address[0].formatted_address);
      console.log("the address......", address, shopperAddress);
    }
  };

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
      otp: "",
      document1: null,
      document2: null,
      billingAddress: "",
      serviceCategory: "",
      serviceSubcategory: "",
      confirmPassword: "",
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      yearsOfExperience: 0,
      businessLocation: "",
      aboutService: "",
      servicePrice: "",
      serviceDuration: "",
      serviceName: "",
      cancellationPolicy: "",
      shopAddress: "",
      availableDays: "",
      availableFrom: "",
      availableTo: "",
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
      bankName: "",
      accountNumber: "",
      institutionNumber: "",
      transitNumber: "",
      latitude: "",
      longitude: "",
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
      if (!userVerified && !completedUserRegistration) {
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
        if (!data.password || data.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
          isValid = false;
        }
        if (data.password !== data.confirmPassword) {
          errors.confirmPassword = "Passwords do not match";
          isValid = false;
        }
        // if (!data.agreeToTerms) {
        //   errors.agreeToTerms = "You must agree to the terms and conditions";
        //   isValid = false;
        // }
      } else {
        data.otp = otp;
        if (!data.otp) {
          errors.otp = "otp is required";
          isValid = false;
        }
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!data.province) {
        errors.province = "Province is required";
        isValid = false;
      }
      if (!data.serviceCategory) {
        errors.serviceCategory = "Service Category is required";
        isValid = false;
      }
      if (!data.serviceSubcategory) {
        errors.serviceSubcategory = "Service Sub Category is required";
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
      if (!data.aboutService) {
        errors.aboutService = "About service is required";
        isValid = false;
      }
    }

    // Step 3 validation
    if (step === 3) {
      data.availableDays = `${selectedDates}`;
      if (!data.availableDays) {
        errors.availableDays = "Days of availability is required";
        isValid = false;
      }
      if (!data.availableFrom) {
        errors.availableFrom = "start time of availability is required";
        isValid = false;
      }
      if (!data.availableTo) {
        errors.availableTo = "end time of availability is required";
        isValid = false;
      }

      data.shopAddress = shopperAddress;
      if (!data.shopAddress) {
        errors.shopAddress = "Shop address is required";
        isValid = false;
      }

      data.latitude = cordinates ? cordinates?.lat : "";
      data.longitude = cordinates ? cordinates?.lng : "";

      if (!data.latitude || !data.longitude) {
        errors.shopAddress = "Error setting lat and long for selected location";
        isValid = false;
      }
    }

    // Step 4 validation
    if (step === 4) {
      if (!data.businessLicense) {
        errors.businessLicense = "business license is required";
        isValid = false;
      }
      // if (!data.proofOfInsurance) {
      //   errors.proofOfInsurance = "proof of insurance is required";
      //   isValid = false;
      // }
    }

    // Step 5 validation -  Business policy
    if (step === 5) {
      if (!data.bookingDetails) {
        errors.bookingDetails = "Booking details is required";
        isValid = false;
      }
      if (!data.cancellationPolicy) {
        errors.cancellationPolicy = "Cancellation policy is required";
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
        if (!/^\d+$/.test(data.accountNumber)) {
          isValid = false;
          errors.accountNumber = "Account number should contain only digits";
        }
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
      if (!data.serviceDuration) {
        errors.serviceDuration = "Service Duration is required";
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

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    const isValid = validateForm(data);

    if (isValid) {
      try {
        setLoading(true);
        if (step === 1) {
          if (!userVerified && !completedUserRegistration) {
            const payload = userRegistrationPayload(data);
            const response = await registerUser("artisan", payload);
            const res = await response?.json();
            if (response && response.ok && response.status === 201) {
              Cookies.set("accessToken", res.token, {
                path: "/",
                secure: true,
                sameSite: "Strict",
                expires: 10 / 24,
              });

              setAuth(true, res.data.user || null, res.token);
              toast.success(res.message);

              setCompletedUserRegistration(true);
            } else {
              formatErrors(res.data.errors, res);
            }
          } else {
            console.log(!userVerified, !completedUserRegistration);
            const payload = otpPayload(data);
            const response = await creatOtp(payload);
            const res = await response?.json();
            if (response && response.ok && response.status === 200) {
              toast.success(res.message);
              setUserVerified(true);
              handleNextStep();
            } else {
              formatErrors(res.data.errors, res);
            }
          }
        }

        if (step === 2) {
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

        if (step === 3) {
          const payload = serviceAvailabilityPayload(data);
          const response = await createServiceAvailability(payload);
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
          const payload = artisanIdentityPayload(data, documentList);
          const response = await createArtisanIdentity(payload);
          if (response) {
            const res = await response.json();

            if (response.ok && response.status === 201) {
              toast.success(res.message);
              localStorage.removeItem("category");
              localStorage.removeItem("subcategory");
              handleNextStep();
            } else {
              formatErrors(res.data.errors, res);
            }
          }
        }

        if (step === 5) {
          const payload = businessPolicyPayload(data);
          const response = await createbusinessPolicy(payload);
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
          const payload = serviceListingPayload(data);
          const response = await createServiceListing(payload);
          if (response) {
            const res = await response.json();

            if (response.ok && response.status === 201) {
              toast.success(res.message);
              setSuccess(true);
            } else {
              formatErrors(res.data.errors, res);
            }
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fix the form errors before submitting.");
    }
  };

  const getButtonText = () => {
    if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;
    if (step === 1) {
      return !userVerified && !completedUserRegistration
        ? "Register"
        : "Verify OTP";
    }
    if (step === 4) return "Submit Documents & Continue";
    if (step === 8) return "Submit";
    return "Save & Continue";
  };

  const getAddressGeoCode = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`
      );
      const data = await response.json();
      if (response.ok) {
        const cordinates = data.results[0].geometry.location;
        console.log("showing cordinates", cordinates);
        return cordinates;
      }
    } catch (error) {
      console.log("error occured when getting cordinates", error);
    }
  };

  const stepTitles: string[] = [
    "Basic Details",
    "Customize Shop Profile",
    "Set Service Areas & Availability",
    "Submit Documentation",
    "Set Business Service Policies",
    "Set Up Payment Preferences",
    "Set Up Billing",
    "Categories & Listing",
  ];

  const handleGetProvinces = async () => {
    const response = await getProvinces();
    if (response && response.ok) {
      const data = await response.json();
      setProvinces(data.data["Provinces"]);
    }
  };

  const getServiceCat = async () => {
    const response = await getServiceCategories();
    if (response && response.ok) {
      const data = await response.json();
      setServiceCategories(data.data["Service Category"]);
    }
  };

  const handlefetchProductCatItems = async (catId) => {
    if (catId) {
      const response = await getServiceCategoryItemsById(catId);
      if (response && response.ok) {
        const data = await response.json();
        if (data.data["Service Category Item By ID"]) {
          setServiceCategoryItems(data.data["Service Category Item By ID"]);
        }
      }
    }
  };

  useEffect(() => {
    getServiceCat();
    handleGetProvinces();

    if (registrationStep) {
      setStep(registrationStep);
    }
  }, [registrationStep]);

  return (
    <div className="max-w-[515px] py-[72px] mx-auto w-full relative">
      {!success ? (
        <>
          <div className="flex items-start mb-[40px] text-[#C28FDA]">
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
              <span className="text-[#C28FDA] md:pl-[250px]">
                {stepTitles[step - 1]}{" "}
              </span>
            </div>
          </div>

          <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 flex flex-col items-center justify-center"
              >
                {step === 1 &&
                  (!userVerified && !completedUserRegistration ? (
                    <>
                      {/* Headings */}
                      <div>
                        <h1 className="text-[28px] md:text-[40px] font-semibold text-[#502266] leading-tight">
                          Create Account
                        </h1>
                        <p className="text-base md:text-lg font-normal text-[#b9b9b9] mb-[10px] pr-4 md:pr-[200px]">
                          For the purpose of industry regulation, your details
                          are required.
                        </p>
                      </div>

                      <div className="flex items-center sm:flex-row flex-col w-full gap-3">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#502266]">
                                First Name*
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
                              <FormLabel className="text-[#502266]">
                                Last Name*
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
                            <FormLabel className="text-[#502266]">
                              Email address*
                            </FormLabel>
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
                              <FormLabel className="text-[#502266]">
                                Create Password*
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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                              <FormLabel className="text-[#502266]">
                                Confirm Password*
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    className="rounded-xl shadow-sm h-12 px-3"
                                    placeholder="******"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      )
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
                      <div className="flex items-center self-start gap-[14px] mt-4">
                        <Checkbox />
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
                      </div>
                      <div className="flex items-center w-full text-gray-400 mt-6">
                        Already have an account?{" "}
                        <a
                          href="/auth/login"
                          className="font-semibold text-primary ml-1 hover:underline"
                        >
                          Login
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className=" w-full flex flex-col gap-y-2 mb-[20px]">
                      <div className="flex items-center sm:flex-row flex-col w-full gap-3">
                        <OtpForm form={form} setOtp={setOtp} />
                      </div>
                    </div>
                  ))}
                {step === 2 && (
                  <div className=" w-full flex flex-col gap-y-2 mb-[20px] ">
                    <h2 className="text-[40px] font-semibold text-[#502266]">
                      Customize Business Profile
                    </h2>
                    <p className="text-lg font-normal text-[#b9b9b9] mb-[10px] pr-[20px]">
                      Tell us about the services you offer: What makes your
                      business stand out?
                    </p>
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#502266]">
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
                          <FormControl>
                            <Select
                              defaultValue={field.value}
                              value={field.value}
                              onValueChange={(selectedValue) => {
                                field.onChange(selectedValue);
                                handlefetchProductCatItems(selectedValue);
                                serviceCategories.find(
                                  (cat) => cat.id === selectedValue
                                );
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceCategories.map((cat, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      className="h-11 rounded-lg px-3"
                                      value={cat.id.toString()}
                                    >
                                      {cat.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
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
                          <FormControl>
                            <Select
                              disabled={serviceCategoryItems.length < 1}
                              defaultValue={field.value}
                              onValueChange={(selectedValue) => {
                                field.onChange(selectedValue);
                                serviceCategoryItems.find(
                                  (cat) => cat.id.toString() === selectedValue
                                );
                              }}
                            >
                              <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                                <SelectValue placeholder="Please Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {serviceCategoryItems.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={item.id.toString()}
                                    className="h-11 rounded-lg px-3"
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aboutService"
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
                              {provinces.map((item: any, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    className="h-11 rounded-lg px-3"
                                    value={item.id.toString()}
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
                  </div>
                )}
                {step === 3 && (
                  <div className="w-full flex flex-col">
                    <h2 className="text-2xl md:text-[40px] font-semibold leading-[30px] md:leading-[50px] text-[#502266]">
                      Set Service Areas & Availability
                    </h2>
                    <p className="text-base md:text-lg font-normal text-[#b9b9b9] mb-[10px] pr-4 md:pr-[200px]">
                      Specify the areas and times you&apos;re available to
                      provide services.
                    </p>

                    <FormField
                      control={form.control}
                      name="availableDays"
                      render={() => (
                        <FormItem className="w-full flex flex-col mb-[22px]">
                          <FormLabel className="text-gray-400 text-base mt-[30px] mb-3">
                            Select Days*
                          </FormLabel>

                          <DatePicker
                            render={
                              <InputIcon className="w-full px-2 rounded-xl  ring-1 ring-[#b9b9b9] py-3 inline-flex justify-center items-center shadow-sm pr-6" />
                            }
                            multiple
                            value={selectedDates}
                            // format="MMMM DD YYYY"
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
                        name="availableFrom"
                        render={({ field }) => (
                          <FormItem className="w-full mb-[22px]">
                            <FormLabel className="text-[#b9b9b9] text-base mb-3">
                              Select Start Time*
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="rounded-xl shadow-sm h-12 px-3 text-[#b9b9b9]"
                                placeholder="MM/YY"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="availableTo"
                        render={({ field }) => (
                          <FormItem className="w-full mb-[22px]">
                            <FormLabel className="text-[#b9b9b9] text-base mb-3">
                              Select End Time*
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="rounded-xl shadow-sm h-12 px-3 text-[#b9b9b9]"
                                placeholder="MM/YY"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <>
                      <FormLabel className="text-[#b9b9b9] text-base mb-3">
                        Artisan Shop Address
                      </FormLabel>
                      {isLoaded && (
                        <div className="flex justify-start items-center w-full px-4">
                          <StandaloneSearchBox
                            onLoad={(ref) => (addressRef.current = ref)}
                            onPlacesChanged={handleOnPlacesChanged}
                          >
                            <div className="w-full">
                              <Input
                                placeholder="Search for a place"
                                className="w-[20em] md:w-[33em] lg-w-full h-14 outline-none border-2 rounded-2xl px-4"
                                style={{ boxSizing: "border-box" }}
                              />
                            </div>
                          </StandaloneSearchBox>
                        </div>
                      )}
                    </>

                    <FormField
                      control={form.control}
                      name="homeService"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-center items-start space-3 py-5 rounded-2xl">
                          <FormLabel className="text-[#b9b9b9] text-base mb-3">
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

                            <FormLabel className="items-center font-normal ml-3">
                              Yes, I offer home services
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {step === 4 && (
                  <div className="flex flex-col gap-y-3  w-full">
                    <h2 className="text-[40px] font-semibold text-[#502266]">
                      Verify Your Identity
                    </h2>
                    <p className="text-lg font-normal text-[#b9b9b9]">
                      Please upload 3-4 relevant certifications based on your
                      service type.
                      <span className="text-[#502266]">
                        &nbsp;Only required fields are marked with an asterisk
                        (*).
                      </span>
                    </p>

                    <p className="text-[#B9B9B9] font-medium text-xl my-5">
                      Basic Business Certifications
                    </p>

                    <FormField
                      control={form.control}
                      name="businessLicense"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#502266] font-normal text-base mb-2">
                            Business License *
                          </FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed relative border-gray-300 px-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                              {/* Display preview and file name */}
                              {businessLicensePreview ? (
                                <div className="mt-4 flex flex-col items-center">
                                  <HiOutlineDocumentArrowUp className="w-10 h-8 text-primary" />
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
                                    <span className="text-primary ">
                                      Click to Upload Business License
                                    </span>
                                  </p>
                                </>
                              )}
                              {/* Hidden Input for File */}
                              <Input
                                type="file"
                                accept="application/pdf"
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
                          <FormLabel className="text-[#b9b9b9] font-normal text-base mb-2">
                            Proof of Insurance{" "}
                            <span className="text-[#502266]">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed relative border-gray-300 px-8 rounded-xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                              {/* Display preview and file name */}
                              {proofOfInsurancePreview ? (
                                <div className="mt-4 flex flex-col items-center">
                                  <HiOutlineDocumentArrowUp className="w-10 h-8 text-primary" />
                                  <p className="mt-2 text-sm text-gray-600">
                                    {value?.name}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <div className="p-2 rounded-full flex items-center justify-center aspect-square mb-2">
                                    <HiOutlineDocumentArrowUp className="w-10 h-8 text-primary " />
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
                                accept="application/pdf"
                                className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  onChange(file);
                                  if (file) {
                                    setproofOfInsurancePreview(
                                      URL.createObjectURL(file)
                                    );
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
                      setDocumentList={setDocumentList}
                    />
                  </div>
                )}
                {step === 5 && (
                  <div className="w-full flex flex-col gap-y-7">
                    <div>
                      <h2 className="text-[40px] font-semibold text-[#502266]">
                        Business Service Policies
                      </h2>
                      <p className="text-lg font-normal text-[#b9b9b9] md:pr-[150px]">
                        Outline your service booking, cancellation, and
                        rebooking policies.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="bookingDetails"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
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
                      name="cancellationPolicy"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
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
                  <div className=" flex flex-col w-full gap-y-7">
                    <div>
                      <div className="text-[40px] font-semibold text-[#502266] leading-[50px] md:pr-[100px]">
                        <p> Set Up Payment Preferences</p>
                      </div>
                      <p className="text-lg font-normal text-[#b9b9b9] md:pr-[290px]">
                        Your payment details will be securely stored and
                        verified.
                      </p>
                    </div>

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
                  <div className="flex flex-col w-full gap-y-4">
                    <h2 className="text-[40px] font-semibold text-[#502266]">
                      Set Up Billing
                    </h2>
                    <div className="text-lg font-normal text-[#b9b9b9] -mt-4 md:pr-[200px]">
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
                  <div className="w-full space-y-[22px] ">
                    <div>
                      <h2 className="text-[40px] font-semibold text-[#502266]">
                        Tell Us About Your Listing
                      </h2>
                      <p className="text-lg font-normal text-[#b9b9b9] md:pr-[50px]">
                        You can add up to 5 categories and customize each
                        listing to match.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="serviceName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
                            Service Title/Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="rounded-xl shadow-sm h-12 px-3"
                              placeholder="Enter name of Service"
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
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
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
                      name="serviceDuration"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
                            Service Duration *
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <SelectTrigger id="duration">
                                <div className="flex items-center">
                                  <Clock10 className="mr-2 h-4 w-4" />
                                  <SelectValue placeholder="Select duration" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                  "10",
                                  "11",
                                  "12",
                                ].map((duration) => (
                                  <SelectItem key={duration} value={duration}>
                                    {duration} hour
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
                            Service Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[100px] rounded-xl shadow-sm px-3 text-[#b9b9b9]"
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
                          <FormLabel className="text-[#b9b9b9] text-base font-normal">
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
                <Button
                  type="submit"
                  className="w-full max-w-sm rounded-xl h-12 mt-4"
                  disabled={loading}
                >
                  {getButtonText()}
                </Button>
                ;
              </form>
            </Form>
          </div>
        </>
      ) : (
        <div>
          <Success />
        </div>
      )}
    </div>
  );
}
