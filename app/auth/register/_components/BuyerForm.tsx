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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

type BuyerFormProps = {
  onBack: () => void;
};

export function BuyerForm({ onBack }: BuyerFormProps) {
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
    },
  });

  const validateForm = (data: FormData): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof FormData, string>> = {};

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
    if (!data.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
      isValid = false;
    }

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
      console.log("Form submitted", data);
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full relative">
      <div className="flex items-start mb-14 mt-3 text-[#C28FDA]">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </div>
      </div>
      <div className="flex justify-center flex-col max-w-md mb-10 w-full">
        <h1 className="text-3xl font-semibold text-primary">Buyer Account</h1>
        <p className="text-md max-w-xs text-gray-400 font-medium">
          For the purpose of industry regulation, your details are required.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 flex flex-col items-center justify-center"
        >
          <div className="flex items-center sm:flex-row flex-col w-full gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-400">First Name</FormLabel>
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
                  <FormLabel className="text-gray-400">Password</FormLabel>
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
                  <FormLabel className="text-gray-400">
                    Confirm Password
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
                <div className="space-y-1 leading-none">
                  <FormLabel>I agree to terms & conditions</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="py-2"></div>
          <Button type="submit" className="w-full max-w-sm rounded-xl h-12">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
