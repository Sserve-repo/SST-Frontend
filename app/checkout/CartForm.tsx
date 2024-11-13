"use client";

import { useState, useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import OrderSummary from "./_components/OrderSummary";

// Define form validation schema using zod
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

type FormData = z.infer<typeof formSchema>;

interface CountrySelectProps {
  value: { value: string; label: string } | null;
  onChange: (value: { value: string; label: string } | null) => void;
  error?: string;
  className?: string;
}
// CountrySelect component for handling country selection
const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  error,
  className,
}) => {
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

// Main CheckoutForm component
export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using formSchema as the type for useForm ensures compatibility
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Define the onSubmit function with FormData as the type
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    // Simulate an API call
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
        <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
          <form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit)} // Use handleSubmit directly with onSubmit
            className="space-y-6 w-full mx-auto"
          >
            <Accordion
              type="multiple"
              defaultValue={["contact", "shipping", "payment"]}
              className="w-full"
            >
              <AccordionItem value="contact">
                <AccordionTrigger className=" font-bold text-black">
                  1. Contact
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mx-4">
                    <div>
                      <Label className="text-purple-900" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        className="w-full bg-[#F7F0FA] py-6 "
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
                        placeholder="+1 (415) 123-4567"
                        {...register("phone")}
                        className="w-full bg-[#F7F0FA] py-6"
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
                <AccordionTrigger>2. Shipping Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mx-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        className="w-full bg-[#F7F0FA] py-6"
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
                        className="w-full bg-[#F7F0FA] py-6"
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
                          className="w-full bg-[#F7F0FA] py-6"
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
                          className="w-full bg-[#F7F0FA] py-6"
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
                            className={
                              "w-full bg-[#F7F0FA] py-4 p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            }
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

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </div>
        <div>
          <OrderSummary register={register} errors={errors} />
        </div>
      </div>
    </div>
  );
}
