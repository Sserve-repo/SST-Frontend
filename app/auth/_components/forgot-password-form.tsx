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
      // TODO: Implement forgot password logic
      console.log(data);
      toast.success("Verification code sent to your email");
      router.push("/auth/verify");
    } catch (error) {
      console.log({ error });
      toast.error("Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-primary">Forget Password</h1>
        <p className="text-md text-gray-400 mt-2">
          Enter your email for the verification process, we will send 4 digits
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
