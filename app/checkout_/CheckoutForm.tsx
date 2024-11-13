"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard } from "lucide-react";
import countryList from "react-select-country-list";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  country: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Please select a country" }
  ),
  cardNumber: z
    .string()
    .regex(/^[0-9]{16}$/, { message: "Card number must be 16 digits" }),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, {
    message: "Expiration date must be in MM/YY format",
  }),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
});

const CountrySelect = ({ value, onChange, error }) => {
  const options = useMemo(() => countryList().getData(), []);

  return (
    <div>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder="Select a country"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log("Order placed!", data);
    toast({
      title: "Order Placed",
      description: "Your order has been successfully placed.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 pr-0 lg:pr-4">
          <form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full mx-auto"
          >
            <Accordion
              type="multiple"
              defaultValue={["contact", "shipping", "payment"]}
              className="w-full"
            >
              <AccordionItem value="contact">
                <AccordionTrigger className="text-purple-950">
                  Contact
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-purple-900" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        id="email"
                        {...register("email")}
                        className="w-full bg-purple-200"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-purple-900" htmlFor="phone">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="w-full bg-purple-200"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        className="w-full bg-purple-200"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className="w-full bg-purple-200"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...register("city")}
                          className="w-full bg-purple-200"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          {...register("postalCode")}
                          className="w-full bg-purple-200"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <CountrySelect
                            className="w-full bg-purple-200 p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.country?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger>Payment Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        {...register("cardNumber")}
                        className="w-full"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expirationDate">Expiration Date</Label>
                        <Input
                          id="expirationDate"
                          placeholder="MM/YY"
                          {...register("expirationDate")}
                          className="w-full"
                        />
                        {errors.expirationDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.expirationDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          {...register("cvv")}
                          className="w-full"
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-100 shadow-md p-4  rounded-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$99.99</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$9.99</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>$10.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>$119.98</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <Button
              type="submit"
              form="checkout-form"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
