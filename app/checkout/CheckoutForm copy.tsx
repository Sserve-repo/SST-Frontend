"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderSummary from "./_components/OrderSummary";

import { useCart } from "@/context/CartContext";
import { addToCart, fetchCart } from "@/actions/cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { createPaymentIntent } from "@/actions/checkout";
import { getProvinces } from "@/actions/provinces";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput from "react-phone-input-2";

// Define form validation schema using
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  postalCode: z
    .string()
    .min(5, { message: "Postal code must be at least 5 characters" }),
  provinceId: z.string().min(1, { message: "Please select a province" }),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartData, setCartData] = useState({});
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [fullname, setFullname] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [provinceId, setProvinceId] = useState("");

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
    console.log("processed", response);
    if (response) {
      console.log("processed", response);
    }
  };

  const createStripePaymentIntent = async () => {
    const response = await createPaymentIntent();
    const data = await response.json();

    if (response.ok) {
      setClientSecret(data.data["clientSecret"]);
      setCheckoutData(data.data);
      console.log("checkout data", data.data);
    }
  };

  useEffect(() => {
    handleGetProvinces();
    handleAddToCart();
    handleFetchCart();
    createStripePaymentIntent();
  }, []);

  const form = useForm<FormData>({
    defaultValues: {
      fullName: "",
      provinceId: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      email: "",
    },
  });

  const onSubmitWithEvent = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePaymentSuccess = (event: React.FormEvent) => {
    console.log("form:", form);
    form.handleSubmit((data) => {
      console.log("Order data:", data);
      // setCheckoutData((prev) => ({ ...prev, ...data }));
    })(event);
  };

  return (
    <div className="container mx-auto py-32">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
          <Form {...form}>
            <form
              id="checkout-form"
              className="space-y-6 w-full mx-auto"
              onSubmit={onSubmitWithEvent}
            >
              <Accordion
                type="multiple"
                defaultValue={["contact", "shipping", "payment"]}
                className="w-full"
              >
                <AccordionItem value="contact">
                  <AccordionTrigger className="font-bold text-black">
                    1. Contact
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mx-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-[#502266]">
                              Full Name*
                            </FormLabel>
                            <FormControl>
                              <Input
                                // {...field}
                                onChange={(e) => setFullname(e.target.value)}
                                type="text"
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="John Pearson"
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
                          <FormItem className="w-full">
                            <FormLabel className="text-[#502266]">
                              Email*
                            </FormLabel>
                            <FormControl>
                              <Input
                                // {...field}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="name@example.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-gray-400">
                              Phone Number
                            </FormLabel>
                            <FormControl className="w-full">
                              <PhoneInput
                                // {...field}
                                // onChange={(e)=>setFullname(e.target.value)}
                                country={"us"}
                                enableSearch={true}
                                inputStyle={{
                                  width: "100%",
                                  borderRadius: "12px",
                                  border: "1px solid #e5e7eb",
                                  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                                  height: "48px",
                                  padding: "0 64px",
                                }}
                                containerStyle={{
                                  width: "100%",
                                }}
                                buttonStyle={{
                                  padding: "8px",
                                  backgroundColor: "#f9fafb",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "12px 0px 0px 12px",
                                }}
                                dropdownStyle={{
                                  zIndex: 50,
                                }}
                                placeholder="+1 (555) 123-4567"
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  autoFocus: true,
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>2. Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mx-4">
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
                                // {...field}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                className="rounded-xl shadow-sm h-12 px-3"
                                placeholder="Lakewood, Shane street, Alabama"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 space-x-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#502266]">
                                City*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  // {...field}
                                  onChange={(e) => setCity(e.target.value)}
                                  type="text"
                                  className="rounded-xl shadow-sm h-12 px-3"
                                  placeholder="Alabama"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#502266]">
                                Postal Code*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  // {...field}
                                  onChange={(e) =>
                                    setPostalCode(e.target.value)
                                  }
                                  type="text"
                                  className="rounded-xl shadow-sm h-12 px-3"
                                  placeholder="N6G3F9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="provinceId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-gray-400">
                              Province
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              // onValueChange={(field) => {
                              //   setProvinceId(field);
                              // }}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl shadow-sm h-12 px-3">
                                  <SelectValue placeholder="Select a province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {provinces.map((item: any, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      className="h-11 rounded-lg px-3"
                                      value={item.id.toString()}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["payment"]}
          className="w-full"
        >
          <AccordionItem value="payment">
            <AccordionTrigger>3. Payment Information</AccordionTrigger>
            <AccordionContent>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    onSuccess={handlePaymentSuccess}
                    checkoutData={checkoutData}
                    fullname={fullname}
                    email={email}
                    postalCode={postalCode}
                    address={address}
                    city={city}
                    provinceId={provinceId}

                    // fullname={form.getValues("fullName")}
                    // email={form.getValues("email")}
                    // postalCode={form.getValues("postalCode")}
                    // address={form.getValues("address")}
                    // city={form.getValues("city")}
                    // provinceId={form.getValues("provinceId")}
                  />
                </Elements>
              ) : (
                <div>Loading payment form...</div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <OrderSummary cartData={cartData} />
        </div>
      </div>
    </div>
  );
}
