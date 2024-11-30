"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import OrderSummary from "./_components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { addToCart, fetchCart } from "@/actions/cart";
import { createPaymentIntent } from "@/actions/checkout";
import { getProvinces } from "@/actions/provinces";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutForm() {
  const [cartData, setCartData] = useState({});
  const { cart } = useCart();
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

  const handleFetchCart = async () => {
    const response = await fetchCart();
    if (response && response.ok) {
      const data = await response.json();
      setCartData(data.data);
    }
  };

  const handleGetProvinces = async () => {
    const response = await getProvinces();
    if (response && response.ok) {
      const data = await response.json();
      setProvinces(data.data["Provinces"]);
    }
  };

  const handleAddToCart = async () => {
    const response = await addToCart(localStorage.getItem("cart") || cart);
    if (response) console.log("Cart updated", response);
  };

  const createStripePaymentIntent = async () => {
    const response = await createPaymentIntent();
    const data = await response.json();
    if (response.ok) {
      setClientSecret(data.data["clientSecret"]);
      setCheckoutData(data.data);
    }
  };

  useEffect(() => {
    handleGetProvinces();
    handleAddToCart();
    handleFetchCart();
    createStripePaymentIntent();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("Form data submitted:", formData);
    localStorage.setItem("formData", JSON.stringify(formData));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData });
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="container mx-auto py-32">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
        <div className="lg:col-span-1 lg:hidden">
          <OrderSummary cartData={cartData} />
        </div>
          <form
            id="checkout-form"
            onSubmit={handleFormSubmit}
            className="space-y-6"
          >
            {/* Contact Information */}
            <div className="border rounded-lg p-4">
              <h2 className="font-bold text-lg mb-4">1. Contact Information</h2>
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
                  {...formData}
                />
              </Elements>
            ) : (
              <p>Loading payment form...</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 hidden lg:block">
          <OrderSummary cartData={cartData} />
        </div>
      </div>
    </div>
  );
}
