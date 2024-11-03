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
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { baseUrl } from "@/config/constant";
import { formatErrors } from "@/config/utils";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
    try {
      setLoading(true);
      validateForm(data);
      const requestPayload = new FormData();
      requestPayload.append("email", data.email);
      requestPayload.append("password", data.password);

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        body: requestPayload,
      });
      const res = await response.json();
      if (response.ok && response.status === 200) {
        if (res.message == "User not Found") {
          toast.error(res.message);
          setLoading(false);
        } else {
          toast.success(res.message);
          localStorage.setItem("accessToken", res.token);
          setLoading(false);
          router.push("/");
        }
      } else {
        if (res?.status_code == 422) {
          const { errors } = res.data;
          formatErrors(errors, res);
        }
      }
    } catch (error: any) {
      console.log("Form validation failed", error);
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
            <Button variant="link" className="text-sm text-primary">
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-full max-w-sm rounded-xl h-12">
            {loading ? "loading" : "Log In"}
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
