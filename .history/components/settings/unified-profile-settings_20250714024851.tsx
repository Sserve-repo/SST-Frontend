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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Clock,
  Truck,
  CalendarIcon,
  Home,
  Globe,
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  type UserProfile,
  type ProfileUpdateData,
  type BillingDetailsData,
  type PaymentMethodData,
} from "@/actions/profile-api";
import {
  updateServiceAreaAvailability,
  updateBusinessPolicy,
  updateShippingPolicy,
  updateVendorIdentity,
  updateBusinessDetails,
} from "@/actions/settings-api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../ui/loading-spinner";
import { format } from "date-fns";
import {
  BusinessDetailsData,
  BusinessPolicyData,
  ServiceAreaAvailabilityData,
  ShippingPolicyData,
  VendorIdentityData,
} from "@/types/settings";

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
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const { setAuth } = useAuth();
  console.log(u)

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

  const serviceAreaForm = useForm<ServiceAreaAvailabilityData>({
    defaultValues: {
      available_dates: [],
      start_time: "",
      end_time: "",
      longitude: "",
      latitude: "",
      home_service_availability: "0",
      service_duration: "",
    },
  });

  const businessForm = useForm<BusinessPolicyData>({
    defaultValues: {
      booking_details: "",
      cancelling_policy: "",
    },
  });

  const shippingForm = useForm<ShippingPolicyData & { user_email: string }>({
    defaultValues: {
      user_email: "",
      shipping_option: "",
      from_day: "",
      to_day: "",
      return_policy: "",
      shipping_cost: "",
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

  const businessDetailsForm = useForm<BusinessDetailsData>({
    defaultValues: {
      business_details: "",
      business_email: "",
      business_phone: "",
      business_name: "",
      product_category_id: "",
      product_region_id: "",
      city: "",
      province_id: "",
      postal_code: "",
    },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data, error } = await getUserProfile();
      if (error) {
        toast.error(error);
        return;
      }

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

        // Set user email for shipping form
        shippingForm.setValue("user_email", data.email || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  }, [form, shippingForm]);

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

  const onServiceAreaSubmit = async (data: ServiceAreaAvailabilityData) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        available_dates: selectedDates.map((date) =>
          format(date, "yyyy-MM-dd")
        ),
      };

      const {
        data: result,
        token,
        error,
      } = await updateServiceAreaAvailability(formattedData);
      if (error) {
        toast.error(error);
        return;
      }

      if (result && token) {
        setAuth(true, currentUser!, token);
        toast.success("Service area availability updated successfully");
      }
    } catch (error) {
      console.error("Error updating service area availability:", error);
      toast.error("Failed to update service area availability");
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

  const onShippingSubmit = async (
    data: ShippingPolicyData & { user_email: string }
  ) => {
    setLoading(true);
    try {
      const { data: result, token, error } = await updateShippingPolicy(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (result && token) {
        setAuth(true, currentUser!, token);
        toast.success("Shipping policy updated successfully");
      }
    } catch (error) {
      console.error("Error updating shipping policy:", error);
      toast.error("Failed to update shipping policy");
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
      // Implementation for billing details update
      toast.success("Billing details updated successfully");
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
      // Implementation for payment method update
      toast.success("Payment method updated successfully");
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Failed to update payment method");
    } finally {
      setLoading(false);
    }
  };

  const onBusinessDetailsSubmit = async (data: BusinessDetailsData) => {
    setLoading(true);
    try {
      const { data: result, token, error } = await updateBusinessDetails(data);
      if (error) {
        toast.error(error);
        return;
      }

      if (result && token) {
        setAuth(true, currentUser!, token);
        toast.success("Business details updated successfully");
      }
    } catch (error) {
      console.error("Error updating business details:", error);
      toast.error("Failed to update business details");
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      "1": { label: "Admin", color: "bg-red-100 text-red-600" },
      "2": { label: "Buyer", color: "bg-purple-100 text-purple-600" },
      "3": { label: "Vendor", color: "bg-blue-100 text-blue-600" },
      "4": { label: "Artisan", color: "bg-green-100 text-green-600" },
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

  // Dynamic tabs based on user type
  const getAvailableTabs = () => {
    const baseTabs = ["profile", "security", "payment"];

    if (isArtisan) {
      baseTabs.push("service-area", "business");
    }

    if (isVendor) {
      baseTabs.push("business-details", "shipping", "identity");
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

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
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`,
          }}
        >
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {/* <TabsTrigger value="payment">Payment</TabsTrigger> */}
          {isArtisan && (
            <TabsTrigger value="service-area">Service Area</TabsTrigger>
          )}
          {isArtisan && (
            <TabsTrigger value="business">Business Policy</TabsTrigger>
          )}
          {isVendor && (
            <TabsTrigger value="business-details">Business Details</TabsTrigger>
          )}
          {isVendor && <TabsTrigger value="shipping">Shipping</TabsTrigger>}
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

        {/* Service Area Tab (Artisan only) */}
        {isArtisan && (
          <TabsContent value="service-area">
            <Form {...serviceAreaForm}>
              <form
                onSubmit={serviceAreaForm.handleSubmit(onServiceAreaSubmit)}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Service Area & Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={serviceAreaForm.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Start Time
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type="time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceAreaForm.control}
                        name="end_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              End Time
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type="time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={serviceAreaForm.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter longitude" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceAreaForm.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter latitude" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={serviceAreaForm.control}
                        name="service_duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Duration (hours)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="2" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceAreaForm.control}
                        name="home_service_availability"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center text-base">
                                <Home className="h-4 w-4 mr-2" />
                                Home Service Available
                              </FormLabel>
                              <FormDescription>
                                Offer services at customer location
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value === "1"}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked ? "1" : "0")
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormLabel className="flex items-center mb-4">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Available Dates
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDates.length && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDates.length > 0
                              ? `${selectedDates.length} dates selected`
                              : "Select available dates"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="start">
                          <Calendar
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={(dates) => setSelectedDates(dates || [])}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {selectedDates.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedDates.map((date, index) => (
                            <Badge key={index} variant="secondary">
                              {format(date, "MMM dd, yyyy")}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Service Area"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
        )}

        {/* Business Tab (Artisan only) */}
        {isArtisan && (
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
                              placeholder="Describe your booking process, requirements, and any special instructions..."
                              className="resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide clear information about how customers can
                            book your services
                          </FormDescription>
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
                              placeholder="Describe your cancellation policy, refund terms, and notice requirements..."
                              className="resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Set clear expectations about cancellations and
                            refunds
                          </FormDescription>
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
        )}

        {/* Shipping Tab (Vendor only) */}
        {isVendor && (
          <TabsContent value="shipping">
            <Form {...shippingForm}>
              <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={shippingForm.control}
                        name="shipping_option"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Option</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shipping option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="car">Car</SelectItem>
                                <SelectItem value="truck">Truck</SelectItem>
                                <SelectItem value="bike">Bike</SelectItem>
                                <SelectItem value="courier">Courier</SelectItem>
                                <SelectItem value="express">
                                  Express Delivery
                                </SelectItem>
                                <SelectItem value="standard">
                                  Standard Delivery
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={shippingForm.control}
                        name="shipping_cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Cost ($)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="25.00"
                                step="0.01"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={shippingForm.control}
                        name="from_day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery From (days)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="2"
                                min="1"
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum delivery time
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={shippingForm.control}
                        name="to_day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery To (days)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="5"
                                min="1"
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum delivery time
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={shippingForm.control}
                      name="return_policy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your return policy, conditions, and timeframes..."
                              className="resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Clearly state your return and refund conditions
                          </FormDescription>
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
                        "Update Shipping Policy"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
        )}

        {/* Identity Tab (Vendor only) */}
        {isVendor && (
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
                              <SelectItem value="tax_certificate">
                                Tax Certificate
                              </SelectItem>
                              <SelectItem value="registration_certificate">
                                Registration Certificate
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
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                              />
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a clear image or PDF of your identity
                            document (max 5MB)
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
        )}

        {/* Business Details Tab (Vendor only) */}
        {isVendor && (
          <TabsContent value="business-details">
            <Form {...businessDetailsForm}>
              <form
                onSubmit={businessDetailsForm.handleSubmit(
                  onBusinessDetailsSubmit
                )}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex text-xl text-primary items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Business Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessDetailsForm.control}
                        name="business_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter business name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessDetailsForm.control}
                        name="business_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="business@example.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessDetailsForm.control}
                        name="business_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="+1 (555) 123-4567"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessDetailsForm.control}
                        name="postal_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="12345" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessDetailsForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessDetailsForm.control}
                        name="province_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Alberta</SelectItem>
                                <SelectItem value="2">
                                  British Columbia
                                </SelectItem>
                                <SelectItem value="3">Manitoba</SelectItem>
                                <SelectItem value="4">New Brunswick</SelectItem>
                                <SelectItem value="5">
                                  Newfoundland and Labrador
                                </SelectItem>
                                <SelectItem value="6">
                                  Northwest Territories
                                </SelectItem>
                                <SelectItem value="7">Nova Scotia</SelectItem>
                                <SelectItem value="8">Nunavut</SelectItem>
                                <SelectItem value="9">Ontario</SelectItem>
                                <SelectItem value="10">
                                  Prince Edward Island
                                </SelectItem>
                                <SelectItem value="11">Quebec</SelectItem>
                                <SelectItem value="12">Saskatchewan</SelectItem>
                                <SelectItem value="13">Yukon</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={businessDetailsForm.control}
                        name="product_category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">
                                  Electronics & Technology
                                </SelectItem>
                                <SelectItem value="2">
                                  Fashion & Clothing
                                </SelectItem>
                                <SelectItem value="3">Home & Garden</SelectItem>
                                <SelectItem value="4">
                                  Sports & Outdoors
                                </SelectItem>
                                <SelectItem value="5">Books & Media</SelectItem>
                                <SelectItem value="6">
                                  Health & Beauty
                                </SelectItem>
                                <SelectItem value="7">Automotive</SelectItem>
                                <SelectItem value="8">
                                  Food & Beverages
                                </SelectItem>
                                <SelectItem value="9">Arts & Crafts</SelectItem>
                                <SelectItem value="10">Baby & Kids</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessDetailsForm.control}
                        name="product_region_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Region</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">North America</SelectItem>
                                <SelectItem value="2">Europe</SelectItem>
                                <SelectItem value="3">Asia Pacific</SelectItem>
                                <SelectItem value="4">Latin America</SelectItem>
                                <SelectItem value="5">
                                  Middle East & Africa
                                </SelectItem>
                                <SelectItem value="6">Global</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={businessDetailsForm.control}
                      name="business_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your business, products, and services..."
                              className="resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a comprehensive description of your business
                            operations
                          </FormDescription>
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
                        "Update Business Details"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
