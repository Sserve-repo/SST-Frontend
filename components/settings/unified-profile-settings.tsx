"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CreditCard,
  Building,
  FileText,
  Upload,
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  updateBusinessPolicy,
  updateVendorIdentity,
  updateBillingDetails,
  updatePaymentMethod,
  type UserProfile,
  type ProfileUpdateData,
  type BusinessPolicyData,
  type VendorIdentityData,
  type BillingDetailsData,
  type PaymentMethodData,
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
  userType,
  showBusinessInfo = false,
  showBankDetails = false,
}: UnifiedProfileSettingsProps) {
  console.log(userType, showBusinessInfo, showBankDetails)
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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

  const businessForm = useForm<BusinessPolicyData>({
    defaultValues: {
      booking_details: "",
      cancelling_policy: "",
    },
  });

  const identityForm = useForm<VendorIdentityData>({
    defaultValues: {
      document_type: "",
      document: undefined as any,
    },
  });

  const billingForm = useForm<BillingDetailsData>({
    defaultValues: {
      card_number: "",
      exp_month: "",
      exp_year: "",
      cvc: "",
      type: "card",
    },
  });

  const paymentForm = useForm<PaymentMethodData>({
    defaultValues: {
      payment_method_id: "",
    },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data, error } = await getUserProfile();
      if (error) {
        toast.error(error);
        return;
      }

      console.log("Fetched user profile:", data);

      if (data) {
        setCurrentUser(data);
        setImagePreview(data.user_photo);
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
      const { data, error, token } = await updateUserPhoto(file);
      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        setCurrentUser(data);
        setImagePreview(data.user_photo);
        if (token) {
          setAuth(true, data, token);
        }
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
        if (newToken) {
          setAuth(true, updatedUser, newToken);
        }
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

  const onBusinessSubmit = async (data: BusinessPolicyData) => {
    setLoading(true);
    try {
      const { data: result, token, error } = await updateBusinessPolicy(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (result && token) {
        setAuth(true, currentUser!, token);
        toast.success("Business policy updated successfully");
      }
    } catch (error) {
      console.error("Error updating business policy:", error);
      toast.error("Failed to update business policy");
    } finally {
      setLoading(false);
    }
  };

  const onIdentitySubmit = async (data: VendorIdentityData) => {
    setLoading(true);
    try {
      const { data: result, token, error } = await updateVendorIdentity(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (result && token) {
        setAuth(true, currentUser!, token);
        toast.success("Vendor identity updated successfully");
      }
    } catch (error) {
      console.error("Error updating vendor identity:", error);
      toast.error("Failed to update vendor identity");
    } finally {
      setLoading(false);
    }
  };

  const onBillingSubmit = async (data: BillingDetailsData) => {
    setLoading(true);
    try {
      const { data: result, error } = await updateBillingDetails(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (result) {
        toast.success("Billing details updated successfully");
      }
    } catch (error) {
      console.error("Error updating billing details:", error);
      toast.error("Failed to update billing details");
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSubmit = async (data: PaymentMethodData) => {
    setLoading(true);
    try {
      const { data: result, error } = await updatePaymentMethod(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (result) {
        toast.success("Payment method updated successfully");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Failed to update payment method");
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

  const isVendor = currentUser.user_type === "3";
  const isArtisan = currentUser.user_type === "4";

  return (
    <div className="max-w-5xl h-full w-full mx-auto p-6 sm:py-8 space-y-2">
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

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex items-end space-x-6 -mt-16">
            <div className="relative">
              <Avatar className="h-36 w-36 aspect-square border-4 border-white shadow-lg">
                <AvatarImage
                  src={imagePreview || ""}
                  alt="Profile photo"
                  className="bg-center object-cover object-center"
                />
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
                  className="text-sm rounded-full bg-transparent"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
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

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          {isArtisan && <TabsTrigger value="business">Business</TabsTrigger>}
          {isVendor && <TabsTrigger value="identity">Identity</TabsTrigger>}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <div className="space-y-6">
            {/* Billing Details */}
            <Form {...billingForm}>
              <form onSubmit={billingForm.handleSubmit(onBillingSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Billing Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={billingForm.control}
                        name="card_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="4242 4242 4242 4242"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={billingForm.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={billingForm.control}
                        name="exp_month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Month</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={billingForm.control}
                        name="exp_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Year</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="2025" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Billing Details"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>

            {/* Payment Method */}
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={paymentForm.control}
                      name="payment_method_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="pm_card_mastercard"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Payment Method"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* Business Tab (Artisan only) */}
        {/* {isArtisan && ( */}
          <TabsContent value="business">
            <Form {...businessForm}>
              <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Business Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={businessForm.control}
                      name="booking_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your booking process..."
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="cancelling_policy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your cancellation policy..."
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Business Policy"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
        {/* )} */}

        {/* Identity Tab (Vendor only) */}
        {/* {isVendor && ( */}
          <TabsContent value="identity">
            <Form {...identityForm}>
              <form onSubmit={identityForm.handleSubmit(onIdentitySubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Vendor Identity Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={identityForm.control}
                      name="document_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="drivers_license">
                                Driver&apos;s License
                              </SelectItem>
                              <SelectItem value="national_id">
                                National ID
                              </SelectItem>
                              <SelectItem value="business_license">
                                Business License
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={identityForm.control}
                      name="document"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Document</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                  }
                                }}
                              />
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a clear image or PDF of your identity
                            document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Update Identity Document"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
        {/* )} */}
      </Tabs>
    </div>
  );
}
