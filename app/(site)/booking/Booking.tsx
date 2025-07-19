"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createServicePaymentIntent } from "@/actions/checkout";
import { getProvinces } from "@/actions/provinces";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Shield,
  Star,
  User,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

import Cookies from "js-cookie";
import BookingOrderSummary from "@/app/(site)/booking/BookingOrderSummary";
import { usePaymentProvider } from "@/context/PaymentContext ";
import { toast } from "sonner";
import { capitalizeFirstLetter } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { getServiceDetail } from "@/actions/service";
import { Label } from "@/components/ui/label";
import { StripeServicePaymentForm } from "@/components/StripeServicePaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Service = {
  "Service Details": any;
};

export default function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = params.get("serviceId");
  const [service, setService] = useState<Service | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const { formData, setFormData, handleInputChange } = usePaymentProvider();
  const [paymentError, setPaymentError] = useState("");

  const handleGetProvinces = useCallback(async () => {
    const response = await getProvinces();
    if (response && response.ok) {
      const data = await response.json();
      setProvinces(data.data["Provinces"]);
    }
  }, []);

  const createStripePaymentIntent = useCallback(async () => {
    const response = await createServicePaymentIntent(serviceId!);
    if (response.ok) {
      const data = await response.json();

      if (data?.error) {
        toast.error(data.error);
        setPaymentError(data.error);
      }

      if (!data.data) {
        setPaymentError("Invalid response format: Missing data object");
        throw new Error("Invalid response format: Missing data object");
      }

      if (!data.data["clientSecret"]) {
        setPaymentError("Invalid response format: Missing client secret");
        throw new Error("Invalid response format: Missing client secret");
      }

      if (data) setClientSecret(data.data["clientSecret"]);
      setCheckoutData(data.data);
    }
  }, [serviceId]);

  const fetchServiceDetail = useCallback(
    async (id) => {
      const response = await getServiceDetail(id);
      if (response && response.ok) {
        const data = await response.json();
        setService(data.data);
        setCheckoutData(data.data);

        setFormData((prev) => ({
          ...prev,
          listingId: data?.data["Service Details"]?.id || "",
        }));
      }
    },
    [setFormData]
  );

  useEffect(() => {
    if (!Cookies.get("accessToken")) router.push("/auth/login");

    if (serviceId) {
      fetchServiceDetail(serviceId);
    }
  }, [fetchServiceDetail, serviceId, router]);

  useEffect(() => {
    (async () => {
      await handleGetProvinces();
      await createStripePaymentIntent();
    })();
  }, [createStripePaymentIntent, handleGetProvinces]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="container mx-auto py-32">
      <>
        <h3 className="text-3xl font-bold mb-6">Checkout</h3>
        {service && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
              <div className="lg:col-span-1 lg:hidden">
                <BookingOrderSummary service={service} />
              </div>
              <div className="mb-4">
                {/* About service */}
                <h2 className="font-bold text-lg mb-4 text-[#502266]">
                  1. About This Service
                </h2>

                <Card className="mb-6">
                  <CardContent className="p-6 space-y-6">
                    {/* Service Information */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#502266] mb-2">
                          {capitalizeFirstLetter(
                            service["Service Details"]?.title
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {capitalizeFirstLetter(
                            service["Service Details"]?.booking_details
                          )}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Service Description
                        </Label>
                        <p className="text-gray-800 leading-relaxed">
                          {capitalizeFirstLetter(
                            service["Service Details"]?.description
                          ) || "No description available for this service."}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Artisan Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF7F00] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#502266]">
                            Service Provider
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Professional Artisan
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            Artisan Name
                          </Label>
                          <p className="text-gray-800">
                            {capitalizeFirstLetter(
                              service["Service Details"]?.artisan_name
                            ) || "Anonymous"}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            Location
                          </Label>
                          <p className="text-gray-800 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            {capitalizeFirstLetter(
                              service["Service Details"]?.booking_details
                            ) || "Location not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Additional Service Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#FF7F00]" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-medium">
                              {service["Service Details"]?.duration ||
                                "To be determined"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#FF7F00]" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Starting Price
                            </p>
                            <p className="text-sm font-medium">
                              $
                              {service["Service Details"]?.price ||
                                "Contact for quote"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#FF7F00]" />
                          <div>
                            <p className="text-xs text-gray-500">Rating</p>
                            <p className="text-sm font-medium">
                              4.5/5 (24 reviews)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Highlights */}
                    {(service["Service Details"]?.features ||
                      service["Service Details"]?.highlights) && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-3 block">
                            Service Highlights
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {/* You can map through features/highlights if they exist in your data */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Professional Quality Work
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Timely Delivery
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Customer Satisfaction Guarantee
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Affordable Pricing
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <form
                  id="checkout-form"
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                >
                  <input
                    hidden
                    value={service["Service Details"]?.id}
                    name="listingId"
                  />
                  {/* Date Information */}
                  <h2 className="font-bold text-lg mb-4">2. Scheduling</h2>
                  <label className="font-bold">Date & Time Availability</label>

                  <select
                    onChange={handleInputChange}
                    className="h-12 mt-2 border-2 w-full px-2"
                    name="dates"
                  >
                    <option value="">Please select</option>
                    {service?.["Date & Time Availability"] &&
                      Object.entries(service["Date & Time Availability"]).map(
                        ([date, times]) =>
                          (times as string[]).map((time, index) => (
                            <option
                              className="my-4 rounded-lg"
                              key={`${date}-${index}`}
                              value={`${date} ${time}`}
                            >
                              {`${date} ${time}`}
                            </option>
                          ))
                      )}
                  </select>

                  <div className="flex space-x-4 flex-col ">
                    <label className="font-bold">
                      Do you want home services{" "}
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="checkbox"
                        name="home_service"
                        onChange={handleInputChange}
                        checked={formData.home_service || false}
                      />

                      <label>Yes, I want Home Services </label>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h2 className="font-bold text-lg mb-4">
                      1. Contact Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Firstname*
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname || ""}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Lastname*
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname || ""}
                          onChange={handleInputChange}
                          placeholder="Pearson"
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number || ""}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.home_service ? (
                    <>
                      {/* Shipping Information */}
                      <div className="border rounded-lg p-4">
                        <h2 className="font-bold text-lg mb-4">
                          2. Shipping Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Address*
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="1234 Main St"
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                City*
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Postal Code*
                              </label>
                              <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="12345"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Province
                            </label>
                            <select
                              name="provinceId"
                              value={formData.provinceId}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            >
                              <option value="">Select a province</option>
                              {provinces.map((province: any) => (
                                <option key={province.id} value={province.id}>
                                  {province.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </form>
              </div>

              {/* Payment Information */}
              <div className="lg:col-span-1">
                <h2 className="font-bold text-lg mb-4 text-[#502266] flex items-center">
                  <span className="bg-[#502266] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    3
                  </span>
                  Payment Information
                </h2>

                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeServicePaymentForm
                      onSuccess={handleFormSubmit}
                      checkoutData={checkoutData}
                    />
                  </Elements>
                ) : paymentError ? (
                  <div className="border rounded-lg p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <div className="text-center">
                      {/* Error Icon */}
                      <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>

                      {/* Error Title */}
                      <h3 className="text-xl font-semibold text-red-800 mb-2">
                        Payment Setup Failed
                      </h3>

                      {/* Error Message */}
                      <div className="bg-white/70 rounded-lg p-4 mb-6 border border-red-200">
                        <p className="text-red-700 text-sm leading-relaxed">
                          {paymentError}
                        </p>
                      </div>

                      {/* Help Text */}
                      <div className="mt-6 pt-4 border-t border-red-200">
                        <p className="text-xs text-red-600">
                          Having trouble? Our support team is here to help you
                          complete your booking.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Loading State */
                  <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                    <div className="flex flex-col justify-center items-center py-8">
                      {/* Loading Animation */}
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-[#502266] border-t-transparent rounded-full animate-spin"></div>
                      </div>

                      {/* Loading Text */}
                      <h3 className="text-lg font-semibold text-[#502266] mt-4 mb-2">
                        Initializing Secure Payment
                      </h3>
                      <p className="text-gray-600 text-sm text-center max-w-xs">
                        Please wait while we prepare your secure payment
                        gateway...
                      </p>

                      {/* Security Badge */}
                      <div className="flex items-center gap-2 mt-6 px-4 py-2 bg-white/70 rounded-lg border border-blue-200">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-700 font-medium">
                          256-bit SSL Encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 hidden lg:block">
              <BookingOrderSummary service={service} />
            </div>
          </div>
        )}
      </>
    </div>
  );
}
