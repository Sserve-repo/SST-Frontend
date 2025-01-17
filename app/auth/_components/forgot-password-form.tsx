"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/constant";

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        toast.success(result.message);

        // Only set localStorage on the client side
        if (typeof window !== "undefined") {
          localStorage.setItem("user_email", data.email);
        }

        router.push("/auth/verify");
      } else {
        toast.error(result.message || "Failed to send verification code");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while sending the verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-primary">Forget Password</h1>
        <p className="text-md text-gray-400 mt-2">
          Enter your email for the verification process, we will send a 4-digit
          code to your email.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="h-12"
                    placeholder="hannah.green@test.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
