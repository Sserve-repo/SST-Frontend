"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { confirmPaymentPayload } from "@/forms/checkout";
import { confirmPayment } from "@/actions/checkout";
import { useRouter } from "next/navigation";

type StripePaymentFormProps = {
  onSuccess: (e: React.FormEvent) => void;
  checkoutData: any;
  fullname: string;
  postalCode: string;
  email: string;
  address: string;
  city: string;
  provinceId: string;
};
export function StripePaymentForm({
  onSuccess,
  checkoutData,
  fullname,
  address,
  city,
  provinceId,
  postalCode,
  email,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShipppingInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    const data_ = localStorage.getItem("formData") || "";
    setShipppingInfo(JSON.parse(data_));
    console.log("----------------------------***..........", shippingInfo);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      // setIsLoading(true);
      const data_ = {
        // fullname,
        // address,
        // postalCode,
        // provinceId,
        // city,
        // email,
        ...checkoutData,
        ...shippingInfo,
        orderId: checkoutData.orderId,
      };
      console.log("shippingoptin***..........", shippingInfo);
      console.log("data***..........", data_);

      if (!stripe || !elements) {
        return;
      }
      const payload = confirmPaymentPayload(data_);
      const response = await confirmPayment(payload);
      const data = await response.json();

      if (response.ok) {
        onSuccess(event);
        setIsLoading(false);
        router.push("/");
      } else {
        setErrorMessage(`error occurec......,${data.data}`);
        setIsLoading(false);
      }
    },
    [stripe, elements]
  );

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full mt-4"
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </form>
  );
}
