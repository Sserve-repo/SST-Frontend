"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Camera,
  Settings,
  Shield,
  Bell,
  Loader2,
  Check,
  Edit3,
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  type UserProfile,
  type ProfileUpdateData,
} from "@/actions/profile-api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../ui/loading-spinner";

interface UnifiedProfileSettingsProps {
  userType?: "admin" | "vendor" | "artisan" | "buyer";
  showBusinessInfo?: boolean;
  showBankDetails?: boolean;
}

export default function UnifiedProfileSettings({
  userType = "buyer",
  showBusinessInfo = false,
  showBankDetails = false,
}: UnifiedProfileSettingsProps) {
  console.log(userType, showBusinessInfo, showBankDetails);

  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { setAuth } = useAuth();

  const form = useForm<ProfileUpdateData>({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      address: "",
      twofa_status: "0",
      email_status: "0",
    },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data, error } = await getUserProfile();
      if (error) {
        toast.error(error);
        return;
      }
      console.log("Fetched user profile data:", data);
      if (data) {
        setCurrentUser(data);
        setImagePreview(data.user_photo);

        // Reset form with fetched data
        form.reset({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          username: data.username || "",
          email: data.email || "",
          address: data.address || "",
          twofa_status: data.twofa_status?.toString() || "0",
          email_status: data.email_status?.toString() || "0",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  }, [form]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setPhotoLoading(true);

    try {
      const { data, error } = await updateUserPhoto(file);
      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        setCurrentUser(data);
        setImagePreview(data.user_photo);
        setAuth(true, data, null);
        toast.success("Profile photo updated successfully");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setPhotoLoading(false);
    }
  };

  const onSubmit = async (data: ProfileUpdateData) => {
    setLoading(true);

    try {
      const {
        data: updatedUser,
        token: newToken,
        error,
      } = await updateUserProfile(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (updatedUser) {
        setCurrentUser(updatedUser);
        // Pass the new token here (do NOT pass null)
        setAuth(
          true,
          updatedUser,
          newToken ?? Cookies.get("accessToken") ?? null
        );

        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      "1": { label: "Admin", color: "bg-red-100 text-red-600" },
      "2": { label: "Vendor", color: "bg-blue-100 text-blue-600" },
      "3": { label: "Artisan", color: "bg-green-100 text-green-600" },
      "4": { label: "Buyer", color: "bg-purple-100 text-purple-600" },
    };
    return types[type] || { label: "User", color: "bg-gray-100 text-gray-600" };
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner />
      </div>
    );
  }

  const userTypeInfo = getUserTypeLabel(currentUser.user_type);

  return (
    <div className="max-w-5xl h-full w-full mx-auto p-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary font-bold text-gray-900">
            Welcome, {currentUser.firstname}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your profile and account settings
          </p>
        </div>
        <Badge className={cn(userTypeInfo.color, "hover:bg-primary/15")}>
          {userTypeInfo.label}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>
            <CardContent className="relative pt-0 pb-6">
              <div className="flex items-end space-x-6 -mt-16">
                <div className="relative">
                  <Avatar className="h-36 w-36 aspect-square border-4 border-white shadow-lg">
                    <AvatarImage src={imagePreview || ""} alt="Profile photo" />
                    <AvatarFallback className="text-2xl">
                      {currentUser.firstname?.[0]}
                      {currentUser.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    {photoLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 text-gray-600" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={photoLoading}
                    />
                  </label>
                </div>
                <div className="flex-1 mt-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {currentUser.firstname} {currentUser.lastname}
                    </h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-sm rounded-full"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-2 w-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 flex text-sm items-center mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {currentUser.email}
                    </p>
                    {currentUser.verified_status === "1" && (
                      <div className="flex items-center space-x-1 text-xs">
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          Verified Account
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex text-xl text-primary items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="Enter your address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Security & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex text-xl text-primary items-center">
                <Settings className="h-5 w-5 mr-2" />
                Security & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email_status"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center text-base">
                          <Bell className="h-4 w-4 mr-2" />
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive updates and notifications via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "1"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "1" : "0")
                          }
                          disabled={!isEditing}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twofa_status"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center text-base">
                          <Shield className="h-4 w-4 mr-2" />
                          Two-Factor Authentication
                        </FormLabel>
                        <FormDescription>
                          Add an extra layer of security to your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "1"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "1" : "0")
                          }
                          disabled={!isEditing}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
