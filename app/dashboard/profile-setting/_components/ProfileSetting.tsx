"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { profilePayload } from "@/forms/profile";
import { baseUrl } from "@/config/constant";
import { Switch } from "@/components/ui/switch";
import { getLoggedInUserDetails } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  user_photo: string;
  address: string;
  username: string;
  email_status: boolean;
  twofa_status: boolean;
};

export default function ProfileSetting() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const [currentUser, setCurrentUser] = useState<FormData | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const userRes = await getLoggedInUserDetails();
    if (userRes) {
      setCurrentUser(userRes.data["User Details"]);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const form = useForm<FormData>({
    defaultValues: {
      firstname: "",
      lastname: "",
      user_photo: "",
      email: "",
      address: "",
      username: "",
      email_status: false,
      twofa_status: false,
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (currentUser) {
      reset({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        user_photo: currentUser.user_photo || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        username: currentUser.username || "",
        email_status: currentUser.email_status || false,
        twofa_status: currentUser.twofa_status || false,
      });
    }
  }, [currentUser, reset]);

  const validateForm = (data: FormData): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof FormData, string>> = {};

    // Validation
    if (!data.firstname) {
      errors.firstname = "firstname is required";
      isValid = false;
    }
    if (!data.lastname) {
      errors.lastname = "lastname is required";
      isValid = false;
    }
    if (!data.username) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!data.address) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!data.email) {
      errors.email = "Email is required";
      isValid = false;
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
      setLoading(true);
      const payload = profilePayload(data);
      const token = Cookies.get("accessToken");
      try {
        const response = await fetch(
          `${baseUrl}/shopper/dashboard/updateUserProfile`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: payload,
          }
        );
        const data = await response.json();
        if (response.ok || response.status === 200) {
          setAuth(true, data.data["User Details"]);
          toast.message("Profile Updated Successfully");
          router.push("/dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 p-3 bg-white rounded-3xl border-2 border-gray-100 w-full px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl tracking-tight my-10 text-center sm:text-left">
            Profile Settings
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 w-full"
            >
              <>
                {/* Profile Image and Username */}
                <div className="flex gap-x-4 border shadow w-full p-8 rounded-lg flex-col sm:flex-row">
                  <Image
                    className="h-20 w-20 rounded-full mb-4 sm:mb-0"
                    src={
                      currentUser?.user_photo ||
                      "/assets/images/tailor.png?height=300&width=400"
                    }
                    height={50}
                    width={50}
                    alt="profile-photo"
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266]">
                          Username*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="Enter your Username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Settings Section */}
                <div className="grid grid-cols-1 border shadow p-8 gap-y-5 rounded-lg">
                  <h1 className="text-2xl sm:text-3xl tracking-tight my-4">
                    Settings
                  </h1>

                  <div className="">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email_status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>
                                Receive updates via email.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="twofa_status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Two-factor Authentication</FormLabel>
                              <FormDescription>
                                Enable 2FA for extra security
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Details Section */}
                <div className="grid grid-cols-1 border shadow p-8 gap-y-5 rounded-lg">
                  <h1 className="text-2xl sm:text-3xl tracking-tight my-4">
                    Personal Details
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="firstname"
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
                      name="lastname"
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
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#502266]">
                          Address*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="rounded-xl shadow-sm h-12 px-3"
                            placeholder="Enter your address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
              <Button
                type="submit"
                className="rounded-xl h-12 mt-4"
                disabled={loading}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
