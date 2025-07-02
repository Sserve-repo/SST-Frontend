"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SubmitHandler, useForm } from "react-hook-form";
import { baseUrl } from "@/config/constant";
import { getLoggedInUserDetails } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import PasswordResetForm from "@/forms/password-reset-form";
import { Loader2, Pencil } from "lucide-react";

interface ProfileFormData {
  firstname: string;
  lastname: string;
  email: string;
  user_photo: string | File;
  address: string;
  username: string;
  email_status: boolean;
  twofa_status: boolean;
}

// Function to build FormData payload for profile updates
export const profilePayload = (
  data: Record<string, any>,
  currentUser: Record<string, any>,
  changedFields: string[]
): globalThis.FormData => {
  const requestPayload = new globalThis.FormData();

  const safeString = (val: unknown): string =>
    typeof val === "string" || typeof val === "number" ? String(val) : "";

  const safeBoolString = (val: unknown): "1" | "0" =>
    val === true || val === "1" ? "1" : "0";

  const fieldsToAppend: (keyof typeof currentUser)[] = [
    "firstname",
    "lastname",
    "email",
    "username",
    "address",
    "email_status",
    "twofa_status",
  ];

  fieldsToAppend.forEach((field) => {
    const useNewValue = changedFields.includes(field);
    const rawValue = useNewValue ? data[field] : currentUser[field];
    const value =
      field === "email_status" || field === "twofa_status"
        ? safeBoolString(rawValue)
        : safeString(rawValue);
    requestPayload.append(field, value);
  });

  if (data.user_photo instanceof File) {
    requestPayload.append("user_photo", data.user_photo);
  }

  return requestPayload;
};

export default function ProfileSetting() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const [currentUser, setCurrentUser] = useState<ProfileFormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const userRes = await getLoggedInUserDetails();
    if (userRes) {
      setCurrentUser(userRes.data["User Details"]);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const form = useForm<ProfileFormData>({
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

  const { reset, setValue } = form;

  useEffect(() => {
    if (currentUser) {
      reset((prev) => ({
        ...prev,
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        username: currentUser.username || "",
        email_status: Boolean(currentUser.email_status),
        twofa_status: Boolean(currentUser.twofa_status),
        user_photo: prev.user_photo, // Keep previous photo if not updated
      }));

      if (
        currentUser.user_photo &&
        typeof currentUser.user_photo === "string"
      ) {
        setImagePreview(currentUser.user_photo);
      }
    }
  }, [currentUser, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setValue("user_photo", file);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    const changedFields = Object.keys(form.formState.dirtyFields);

    if (!currentUser) {
      toast.error("Current user data is not available");
      setLoading(false);
      return;
    }
    setLoading(true);

    const payload = profilePayload(data, currentUser, changedFields);
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

      const responseData = await response.json();

      if (response.ok || response.status === 200) {
        setAuth(true, responseData.data["User Details"], responseData?.token);
        setCurrentUser(responseData.data["User Details"]);
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(responseData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-lightblue-200 to-lightblue-100">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome, {currentUser?.firstname}
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-10"
          >
            {/* Profile Image Section */}
            <Card className="border">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={
                      imagePreview ||
                      currentUser?.user_photo?.toString() ||
                      "/assets/images/image-placeholder.png"
                    }
                    alt="avatar"
                    className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
                  />
                  <label className="absolute bottom-2 right-2 bg-white shadow rounded-full p-2 cursor-pointer">
                    <Pencil className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Click the pencil icon to upload a new profile picture
                </p>
              </CardContent>
            </Card>

            {/* Basic Information Section */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["firstname", "lastname", "username", "email", "address"].map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof ProfileFormData}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary capitalize">
                            {fieldName}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value as string}
                              placeholder={`Enter your ${fieldName}`}
                              className="bg-gray-100 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "email_status",
                    label: "Email Notifications",
                    description: "Receive updates via email",
                  },
                  {
                    name: "twofa_status",
                    label: "Two-factor Authentication",
                    description: "Enable 2FA for extra security",
                  },
                ].map((pref) => (
                  <FormField
                    key={pref.name}
                    control={form.control}
                    name={pref.name as keyof ProfileFormData}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <div>
                          <FormLabel className="text-sm font-medium">
                            {pref.label}
                          </FormLabel>
                          <FormDescription>{pref.description}</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center mb-8">
              <Button
                type="submit"
                className=" text-white px-6 py-4 bg-primary hover:bg-primary/90 rounded-lg shadow-md transition-colors duration-200"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Reset Password Section */}
        <div className="mt-12">
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
}
