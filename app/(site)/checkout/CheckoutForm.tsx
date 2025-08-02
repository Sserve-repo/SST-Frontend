// "use client";

// import { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import { StripePaymentForm } from "@/components/StripeProductPaymentForm";
// import OrderSummary from "./_components/OrderSummary";
// import { createPaymentIntent } from "@/actions/checkout";
// import { getProvinces } from "@/actions/provinces";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import { fetchCart } from "@/actions/cart";
// import { usePaymentProvider } from "@/context/PaymentContext ";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// export default function CheckoutForm() {
//   const router = useRouter();
//   const [isLoadingCart, setIsLoadingCart] = useState(true);
//   const [cartData, setCartData] = useState([]);
//   const [clientSecret, setClientSecret] = useState("");
//   const [checkoutData, setCheckoutData] = useState({});
//   const [provinces, setProvinces] = useState([]);
//   const [cartMetadata, setCartMetadata] = useState<any | null>(null);
//   const { formData, handleInputChange } = usePaymentProvider();

//   const handleFetchCart = async () => {
//     try {
//       const response = await fetchCart();
//       if (response && response.ok) {
//         const data = await response.json();
//         setCartData(data.data["Cart Items"]);
//         setCartMetadata(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     } finally {
//       setIsLoadingCart(false);
//     }
//   };

//   const handleGetProvinces = async () => {
//     const response = await getProvinces();
//     if (response && response.ok) {
//       const data = await response.json();
//       setProvinces(data.data["Provinces"]);
//     }
//   };

//   const createStripePaymentIntent = async () => {
//     const response = await createPaymentIntent();
//     if (response.ok) {
//       const data = await response.json();
//       setClientSecret(data.data["clientSecret"]);
//       setCheckoutData(data.data);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       await handleFetchCart();
//       await handleGetProvinces();
//       await createStripePaymentIntent();
//     })();
//   }, []);

//   useEffect(() => {
//     console.log("cart length", cartData);
//     if (!isLoadingCart && cartData && cartData.length === 0) {
//       router.push("/");
//     }
//   }, [isLoadingCart, cartData, router]);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form data submitted:", formData);
//   };

//   return isLoadingCart ? (
//     <div className="flex flex-col justify-center items-center">
//       <Loader2 className="animate-spin h-[5rem] w-[5rem] text-purple-900" />
//       <p>Loading cart...</p>
//     </div>
//   ) : (
//     <>
//       {!cartData && (
//         <div className="container mx-auto flex justify-center items-center flex-col min-h-screen px-4 py-24 text-center">
//           <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="mb-4">
//             Looks like you haven&apos;t added any items to your cart yet.
//           </p>
//           <Link href="/products">
//             <Button>Continue Shopping</Button>
//           </Link>
//         </div>
//       )}

//       <div className="container mx-auto py-32">
//         {cartData && cartData.length > 0 && (
//           <>
//             <h1 className="text-3xl font-bold mb-6">Checkout</h1>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
//                 <div className="lg:col-span-1 lg:hidden">
//                   <OrderSummary cartMetadata={cartMetadata} />
//                 </div>
//                 <form
//                   id="checkout-form"
//                   onSubmit={handleFormSubmit}
//                   className="space-y-6"
//                 >
//                   {/* Contact Information */}
//                   <div className="border rounded-lg p-4">
//                     <h2 className="font-bold text-lg mb-4">
//                       1. Contact Information
//                     </h2>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Full Name*
//                         </label>
//                         <input
//                           type="text"
//                           name="fullname"
//                           value={formData.fullname}
//                           onChange={handleInputChange}
//                           placeholder="John Pearson"
//                           className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Email*
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           placeholder="name@example.com"
//                           className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           placeholder="+1 (555) 123-4567"
//                           className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Shipping Information */}
//                   <div className="border rounded-lg p-4">
//                     <h2 className="font-bold text-lg mb-4">
//                       2. Shipping Information
//                     </h2>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Address*
//                         </label>
//                         <input
//                           type="text"
//                           name="address"
//                           value={formData.address}
//                           onChange={handleInputChange}
//                           placeholder="1234 Main St"
//                           className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             City*
//                           </label>
//                           <input
//                             type="text"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleInputChange}
//                             placeholder="City"
//                             className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             Postal Code*
//                           </label>
//                           <input
//                             type="text"
//                             name="postalCode"
//                             value={formData.postalCode}
//                             onChange={handleInputChange}
//                             placeholder="12345"
//                             className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Province
//                         </label>
//                         <select
//                           name="provinceId"
//                           value={formData.provinceId}
//                           onChange={handleInputChange}
//                           className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
//                         >
//                           <option value="">Select a province</option>
//                           {provinces.map((province: any) => (
//                             <option key={province.id} value={province.id}>
//                               {province.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </form>

//                 {/* Payment Information */}
//                 <div className="lg:col-span-1">
//                   <h2 className="font-bold text-lg mb-4">
//                     3. Payment Information
//                   </h2>
//                   {clientSecret ? (
//                     <Elements stripe={stripePromise} options={{ clientSecret }}>
//                       <StripePaymentForm
//                         onSuccess={handleFormSubmit}
//                         checkoutData={checkoutData}
//                       />
//                     </Elements>
//                   ) : (
//                     <div className="flex flex-col justify-center items-center">
//                       <Loader2 className="animate-spin text-purple-950 h-[3rem] w-[3rem]" />
//                       <p>Loading paywall...</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="lg:col-span-1 hidden lg:block">
//                 <OrderSummary cartMetadata={cartMetadata} />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "@/components/StripeProductPaymentForm";
import OrderSummary from "./_components/OrderSummary";
import { createPaymentIntent } from "@/actions/checkout";
import { getProvinces } from "@/actions/provinces";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw, CreditCard } from "lucide-react";
import { fetchCart } from "@/actions/cart";
import { usePaymentProvider } from "@/context/PaymentContext ";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutForm() {
  const router = useRouter();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cartMetadata, setCartMetadata] = useState<any | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { formData, handleInputChange } = usePaymentProvider();

  const handleFetchCart = async () => {
    try {
      const response = await fetchCart();
      if (response && response.ok) {
        const data = await response.json();
        setCartData(data.data["Cart Items"]);
        setCartMetadata(data.data);
      } else {
        throw new Error("Failed to fetch cart data");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setPaymentError("Unable to load cart items. Please refresh the page.");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleGetProvinces = async () => {
    try {
      const response = await getProvinces();
      if (response.data && !response.error) {
        setProvinces(response.data.data["Provinces"]);
      } else {
        console.warn("Failed to fetch provinces:", response.error);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const createStripePaymentIntent = useCallback(async (isRetry = false) => {
    try {
      setIsLoadingPayment(true);
      setPaymentError(null);

      const response = await createPaymentIntent();

      if (response.ok) {
        const data = await response.json();

        if (data.data && data.data["clientSecret"]) {
          setClientSecret(data.data["clientSecret"]);
          setCheckoutData(data.data);
          setRetryCount(0); // Reset retry count on success
        } else {
          throw new Error("Invalid payment response: Missing client secret");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Payment setup failed (${response.status})`
        );
      }
    } catch (error: any) {
      console.error("Error creating payment intent:", error);

      let errorMessage = "Unable to initialize payment system. ";

      if (error.message.includes("client secret")) {
        errorMessage += "Payment configuration is missing.";
      } else if (error.message.includes("401")) {
        errorMessage += "Please log in to continue.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage += "Please check your internet connection.";
      } else {
        errorMessage += "Please try again or contact support.";
      }

      setPaymentError(errorMessage);

      // Auto-retry logic (max 2 retries)
      if (!isRetry && retryCount < 2) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => {
          createStripePaymentIntent(true);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoadingPayment(false);
    }
  }, [retryCount]);

  const handleRetryPayment = () => {
    setRetryCount(0);
    createStripePaymentIntent();
  };

  useEffect(() => {
    (async () => {
      await handleFetchCart();
      await handleGetProvinces();
      await createStripePaymentIntent();
    })();
  }, [createStripePaymentIntent]);

  useEffect(() => {
    console.log("cart length", cartData);
    if (!isLoadingCart && cartData && cartData.length === 0) {
      router.push("/");
    }
  }, [isLoadingCart, cartData, router]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  // Loading state for cart
  if (isLoadingCart) {
    return (
      <div className="container mx-auto flex flex-col justify-center items-center min-h-screen px-4">
        <Loader2 className="animate-spin h-16 w-16 text-[#502266] mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Loading your cart...
        </h2>
        <p className="text-gray-500">
          Please wait while we prepare your checkout
        </p>
      </div>
    );
  }

  // Empty cart state
  if (!cartData || cartData.length === 0) {
    return (
      <div className="container mx-auto flex justify-center items-center flex-col min-h-screen px-4 py-24 text-center">
        <div className="bg-gray-50 rounded-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button className="bg-[#502266] hover:bg-[#502266]/90 text-white px-6 py-2">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-32">
      <h1 className="text-3xl font-bold mb-6 text-[#502266]">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Mobile Order Summary */}
          <div className="lg:hidden">
            <OrderSummary cartMetadata={cartMetadata} />
          </div>

          <form
            id="checkout-form"
            onSubmit={handleFormSubmit}
            className="space-y-6"
          >
            {/* Contact Information */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-[#502266] flex items-center">
                <span className="bg-[#502266] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  1
                </span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="John Pearson"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-[#502266] flex items-center">
                <span className="bg-[#502266] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                  2
                </span>
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="1234 Main St"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code*
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="12345"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <select
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#502266] focus:border-[#502266] h-12 border px-3"
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
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-[#502266] flex items-center">
              <span className="bg-[#502266] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                3
              </span>
              Payment Information
            </h2>

            {paymentError ? (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <div className="flex flex-col gap-3">
                    <span>{paymentError}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRetryPayment}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Link href="/cart">
                        <Button size="sm" variant="outline">
                          Back to Cart
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ) : isLoadingPayment ? (
              <div className="flex flex-col justify-center items-center py-8">
                <Loader2 className="animate-spin text-[#502266] h-12 w-12 mb-3" />
                <p className="text-gray-600">Initializing secure payment...</p>
                {retryCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Retry attempt {retryCount}/2
                  </p>
                )}
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  onSuccess={handleFormSubmit}
                  checkoutData={checkoutData}
                />
              </Elements>
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Payment system is temporarily unavailable. Please try
                  refreshing the page.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Desktop Order Summary */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-32">
            <OrderSummary cartMetadata={cartMetadata} />
          </div>
        </div>
      </div>
    </div>
  );
}
