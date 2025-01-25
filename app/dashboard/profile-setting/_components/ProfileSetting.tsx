"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SubmitHandler, useForm } from "react-hook-form";
import { profilePayload } from "@/forms/profile";
import { baseUrl } from "@/config/constant";
import { getLoggedInUserDetails } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import PasswordResetForm from "@/forms/password-reset-form";
import { UserCircle2 } from "lucide-react";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  user_photo: string | File;
  address: string;
  username: string;
  email_status: boolean;
  twofa_status: boolean;
};

export default function ProfileSetting() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const [currentUser, setCurrentUser] = useState<FormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
  const { reset, setValue } = form;

  useEffect(() => {
    if (currentUser) {
      const initialData = {
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        user_photo: currentUser.user_photo || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        username: currentUser.username || "",
        email_status: Boolean(currentUser.email_status),
        twofa_status: Boolean(currentUser.twofa_status),
      };
      reset(initialData);
      if (currentUser.user_photo) {
        setImagePreview(currentUser.user_photo.toString());
      }
    }
  }, [currentUser, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue("user_photo", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (data: FormData): boolean => {
    let isValid = true;
    const errors: Partial<Record<keyof FormData, string>> = {};
    const changedFields = Object.keys(form.formState.dirtyFields);

    // Only validate fields that have been changed
    if (changedFields.includes("firstname") && !data.firstname) {
      errors.firstname = "First name is required";
      isValid = false;
    }
    if (changedFields.includes("lastname") && !data.lastname) {
      errors.lastname = "Last name is required";
      isValid = false;
    }
    if (changedFields.includes("username") && !data.username) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (changedFields.includes("address") && !data.address) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (changedFields.includes("email") && !data.email) {
      errors.email = "Email is required";
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
    const changedFields = Object.keys(form.formState.dirtyFields);
    const isPhotoOnly =
      changedFields.length === 0 && data.user_photo instanceof File;

    // Skip validation if only updating photo
    if (!isPhotoOnly) {
      const isValid = validateForm(data);
      if (!isValid) {
        toast.error("Please fix the form errors before submitting.");
        return;
      }
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
        setAuth(true, responseData.data["User Details"]);
        toast.success("Profile Updated Successfully");
        router.push("/dashboard");
      } else {
        // Handle validation errors from the server
        if (responseData.status_code === 422 && responseData.data?.errors) {
          Object.keys(responseData.data.errors).forEach((key) => {
            form.setError(key as keyof FormData, {
              type: "manual",
              message: responseData.data.errors[key][0],
            });
          });
          toast.error("Please fix the form errors");
        } else {
          toast.error(responseData.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/50 w-full">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold text-primary mb-8">
          Profile Settings
        </h1>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-6">
                {/* Profile Section */}
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24 border-2 border-primary/10">
                          <AvatarImage
                            src={
                              imagePreview ||
                              currentUser?.user_photo?.toString()
                            }
                            alt="Profile photo"
                          />
                          <AvatarFallback className="bg-secondary">
                            <UserCircle2 className="h-12 w-12 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full max-w-[250px] bg-secondary text-sm"
                        />
                      </div>
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary">
                                Username
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-secondary border-none h-12"
                                  placeholder="Enter your username"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Settings Section */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="email_status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 bg-secondary">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive updates via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twofa_status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 bg-secondary">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Two-factor Authentication
                            </FormLabel>
                            <FormDescription>
                              Enable 2FA for extra security
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Personal Details Section */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-secondary border-none h-12"
                                placeholder="Enter your first name"
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
                          <FormItem>
                            <FormLabel className="text-primary">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-secondary border-none h-12"
                                placeholder="Enter your last name"
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
                        <FormItem>
                          <FormLabel className="text-primary">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-secondary border-none h-12"
                              placeholder="Enter your email address"
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
                        <FormItem>
                          <FormLabel className="text-primary">
                            Location/Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-secondary border-none h-12"
                              placeholder="Enter your location or address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-12"
                  disabled={loading}
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>

          {/* Password Reset Section */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Reset Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <PasswordResetForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
