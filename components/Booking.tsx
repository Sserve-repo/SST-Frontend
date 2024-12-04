"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { createPaymentIntent } from "@/actions/checkout";
import { getProvinces } from "@/actions/provinces";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingOrderSummary from "@/app/booking/BookingOrderSummary";
import { getServiceDetail } from "@/actions/service";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type ArtisanListing = {
  image: string;
  artisan_business_details: string;
  artisan_service_area: string;
  artisan_business_policy: string;
};

type Artisan = {
  artisan_service_listing: ArtisanListing[];
  artisan_business_details: any;
  artisan_service_area: any;
  artisan_business_policy: any;
};

export default function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = params.get("serviceId");
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [selectedDates, setSelectedDates] = useState<[] | undefined>(undefined);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    provinceId: "",
  });

  const handleGetProvinces = async () => {
    const response = await getProvinces();
    if (response && response.ok) {
      const data = await response.json();
      setProvinces(data.data["Provinces"]);
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("***** dates:", selectedDates);
  };

  const createStripePaymentIntent = async () => {
    const response = await createPaymentIntent();
    if (response.ok) {
      const data = await response.json();
      setClientSecret(data.data["clientSecret"]);
      setCheckoutData(data.data);
    }
  };

  const fetchServiceDetail = async (id) => {
    const response = await getServiceDetail(id);
    if (response && response.ok) {
      const data = await response.json();
      setArtisan(data.data);
      setCheckoutData(data.data);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/login");
    }
    if (serviceId) {
      fetchServiceDetail(serviceId);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await handleGetProvinces();
      await createStripePaymentIntent();
    })();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem(
      "formData",
      JSON.stringify({ ...formData, [name]: value })
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return isLoadingCart ? (
    <div className="flex flex-col justify-center items-center">
      <Loader2 className="animate-spin h-[5rem] w-[5rem] text-purple-900" />
      <p>Loading cart...</p>
    </div>
  ) : (
    <div className="container mx-auto py-32">
      <>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
            <div className="lg:col-span-1 lg:hidden">
              <BookingOrderSummary artisan={artisan} />
            </div>
            <form
              id="checkout-form"
              onSubmit={handleFormSubmit}
              className="space-y-6"
            >
              {/* Contact Information */}
              <div className="border rounded-lg p-4">
                <h1 className="text-2xl">
                  {artisan && artisan["Service Details"].title}
                </h1>
                <label className="block text-sm font-medium text-gray-700">
                  Select dates
                </label>

                <DatePicker
                  // highlightToday={false}
                  // onOpenPickNewDate={false}
                  // value={selectedDates}
                  autoFocus={true}
                  name={"availableDays"}
                  onChange={(dates) => {
                    handleDateChange(dates);
                  }}
                  className="purple w-full"
                  calendarClassName="purple "
                  inline
                />

                <h2 className="font-bold text-lg mb-4">
                  1. Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder="John Pearson"
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
                      value={formData.email}
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
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                    />
                  </div>
                </div>
              </div>

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
            </form>

            {/* Payment Information */}
            <div className="lg:col-span-1">
              <h2 className="font-bold text-lg mb-4">3. Payment Information</h2>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    onSuccess={handleFormSubmit}
                    checkoutData={checkoutData}
                    // {...formData}
                  />
                </Elements>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <Loader2 className="animate-spin text-purple-950 h-[3rem] w-[3rem]" />
                  <p>Loading paywall...</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 hidden lg:block">
            <BookingOrderSummary artisan={artisan} />
          </div>
        </div>
      </>
    </div>
  );
}
