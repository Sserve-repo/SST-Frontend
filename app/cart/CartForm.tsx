"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import countryList from "react-select-country-list";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import OrderSummary from "./_components/OrderSummary";
import CartItem from "./CartItem";

const items = [
  {
    id: 1,
    name: "Adjustable Standing Desk",
    price: 299.99,
    rating: 4.5,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 2,
    name: "Ergonomic Keyboard",
    price: 79.99,
    rating: 4.3,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 3,
    name: "Anti-Fatigue Mat",
    price: 39.99,
    rating: 4.6,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 4,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 5,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 6,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 7,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 8,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
  {
    id: 9,
    name: "Monitor Arm",
    price: 89.99,
    rating: 4.4,
    image: "/assets/images/cement.png?height=200&width=200",
    quantity: 20,
  },
];

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
  const [products, setProducts] = useState<any>([]);

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

  useEffect(() => {
    setProducts(items);
  }, []);

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CartItem products={products} setProducts={setProducts} />
        <div>
          <OrderSummary register={register} errors={errors} />
        </div>
      </div>
    </div>
  );
}
