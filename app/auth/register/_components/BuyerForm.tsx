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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Loader } from "lucide-react";
import { Success } from "./Success";
import { toast } from "sonner";
import { formatErrors } from "@/config/utils";
import { OtpForm } from "./OtpForm";
import { otpPayload } from "@/forms/artisans";
import { userRegistrationPayload } from "@/forms/vendors";
import { registerUser } from "@/actions/auth";
import { creatOtp } from "@/actions/buyer";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

type BuyerFormProps = {
  onBack: () => void;
};

export function BuyerForm({ onBack }: BuyerFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

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
      if (!data.agreeToTerms) {
        errors.agreeToTerms = "You must agree to the terms and conditions";
        isValid = false;
      }
    }

    // Step 2 validation
    if (step === 2) {
      data.otp = otp;
      if (!data.otp) {
        errors.otp = "OTP is required";
        isValid = false;
      }
    }

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
      setIsLoading(true);

      try {
        if (step === 1) {
          const payload = userRegistrationPayload(data);
          const response = await registerUser("shopper", payload);
          if (response) {
            const res = await response.json();

            if (response.ok && response.status === 201) {
              toast.success(res.message || "Account created successfully!");
              handleNextStep();
            } else {
              toast.error(res.message || "Error creating account.");
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
              toast.success(res.message || "OTP verified successfully!");
              setEmail(res.data.email);
              setSuccess(true);
            } else {
              toast.error(res.message || "Error verifying OTP.");
              formatErrors(res.data.errors, res);
            }
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const stepTitles: string[] = ["Create Account", "Confirm OTP"];

  return (
    <div className="max-w-lg mx-auto w-full relative">
      {!success ? (
        <div>
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
              </span>
              <span className="text-[#C28FDA]">{stepTitles[step - 1]}</span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 flex flex-col items-center justify-center"
            >
              {step === 1 && (
                <>
                  <div>
                    <div className="flex justify-center flex-col max-w-md mb-[30px] w-full">
                      <h1 className="text-[40px] font-semibold text-[#502266]">
                        Buyer Account
                      </h1>
                      <p className="text-lg font-normal text-[#b9b9b9] md:pr-[100px]">
                        For the purpose of industry regulation, your details are
                        required.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-row flex-col w-full gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[#502266] text-base font-normal">
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
                          <FormLabel className="text-[#502266] text-base font-normal">
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
                        <FormLabel className="text-[#502266] text-base font-normal">
                          Email*
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
                          <FormLabel className="text-[#502266] text-base font-normal">
                            Password*
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="*******************"
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
                            Confirm Password*
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="*******************"
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
                            <p className="font-normal text-base text-[#502266]">
                              I agree to the &nbsp;
                              <span className="text-[#240F2E] hover:underline">
                                <a href="#">Terms and Conditions</a>
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
                  <OtpForm form={form} setOtp={setOtp} />
                </>
              )}

              <Button
                type="submit"
                className="w-full max-w-sm rounded-xl h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <Success email={email} />
      )}
    </div>
  );
}
