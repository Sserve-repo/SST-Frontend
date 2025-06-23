"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { baseUrl } from "@/config/constant";

const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords don't match",
    path: ["new_password_confirmation"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PasswordResetForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    const token = Cookies.get("accessToken");

    try {
      const formData = new FormData();
      formData.append("current_password", data.current_password);
      formData.append("new_password", data.new_password);
      formData.append(
        "new_password_confirmation",
        data.new_password_confirmation
      );

      const response = await fetch(`${baseUrl}/user/resetPassword`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border bg-white shadow p-8 rounded-3xl">
      <h1 className="text-xl sm:text-2xl text-primary font-semibold tracking-tight mb-6">
        Reset Password
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="rounded-xl shadow-sm h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="rounded-xl shadow-sm h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="rounded-xl shadow-sm h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="rounded-xl h-12" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
