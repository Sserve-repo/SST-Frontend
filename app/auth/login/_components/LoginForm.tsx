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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatErrors } from "@/config/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, resendOtp } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getUserType = (user_type: string) => {
    return user_type === "3"
      ? "vendor"
      : user_type === "2"
      ? "buyer"
      : user_type === "4"
      ? "artisan"
      : null;
  };

  const validateForm = (data: FormData): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email address";
      isValid = false;
    }
    if (!data.password || data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    if (!validateForm(data)) {
      toast.error("Please correct the highlighted errors.");
      return;
    }

    try {
      setLoading(true);
      const requestPayload = new FormData();
      requestPayload.append("email", data.email);
      requestPayload.append("password", data.password);

      const response = await loginUser(requestPayload);
      if (!response?.ok) {
        throw Error("Email or password incorrect");
      }

      const responseData = await response?.json();
      console.log({ responseData });
      setAuth(true, responseData.data?.user, responseData.token);

      const { registration_status, is_completed, user_type, verified_status } =
        responseData?.data?.user;

      const type = getUserType(user_type);
      if (parseInt(is_completed) == 1) {
        toast.success("Login successful! Redirecting...");
        if (redirect) {
          router.push(`/${redirect}`);
          return;
        } else {
          router.push(`/${type}/dashboard`);
          return;
        }
      }

      if (parseInt(is_completed) !== 1) {
        if (!verified_status || parseInt(verified_status) !== 1) {
          toast.info("Account not verified. Redirecting to verification...");
          await resendOtp(data.email);
          router.push(`/auth/register?role=${type}&&step=2`);
          return;
        }

        let step = parseInt(registration_status.replace("step", ""));
        step = step === 1 ? step + 1 : step + 1;
        router.push(`/auth/register?role=${type}&&step=${step}`);
        return;
      }

      if (responseData?.status_code === 404) {
        const { message } = responseData.data;
        toast.error(message);
        return;
      }

      if (responseData?.data?.status_code === 422) {
        const { errors } = responseData.data;
        formatErrors(errors, form);
        toast.error("Please fix the form errors and try again.");
        return;
      }

      toast.error(
        responseData?.data?.message || "An unexpected error occurred."
      );
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full relative">
      <div className="flex justify-center flex-col max-w-md mb-10 w-full">
        <h1 className="text-4xl font-bold text-primary">Login</h1>
        <p className="text-md max-w-xs text-gray-400 font-medium">
          Please enter your credentials to access your account.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 flex flex-col items-center justify-center"
        >
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
          <div className="w-full flex justify-end">
            <Link
              type="button"
              href="/auth/forgot-password/"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full max-w-sm rounded-xl h-12 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log In"}
          </Button>
        </form>
      </Form>
      <div className="flex items-center w-full text-gray-400 mt-6">
        If you don&lsquo;t have an account?{" "}
        <a
          href="/auth/register"
          className="font-semibold text-primary ml-1 hover:underline"
        >
          Register
        </a>
      </div>
    </div>
  );
}
