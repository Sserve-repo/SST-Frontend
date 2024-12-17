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
import { useCart } from "@/context/CartContext";

type StripePaymentFormProps = {
  onSuccess: (e: React.FormEvent) => void;
  checkoutData: any;
};
export function StripePaymentForm({
  onSuccess,
  checkoutData,
}: StripePaymentFormProps) {
  const { clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShipppingInfo] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const data_ = localStorage.getItem("formData") || "";
    if (data_) {
      setShipppingInfo(JSON.parse(data_));
    }
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      const data_ = {
        ...checkoutData,
        ...shippingInfo,
        orderId: checkoutData.orderId,
      };

      if (!stripe || !elements) {
        return;
      }
      const payload = confirmPaymentPayload(data_);
      const response = await confirmPayment(payload);
      const data = await response.json();

      if (response.ok) {
        onSuccess(event);
        setIsLoading(false);
        setSuccessMessage("Payment Successfull...");
        localStorage.removeItem("formData");

        clearCart();
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setErrorMessage(`An error occured......,${data.data}`);
        setIsLoading(false);
      }
    },
    [stripe, elements, clearCart, checkoutData, onSuccess, router, shippingInfo]
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
      {successMessage && (
        <div className="text-red-500 mt-2 inline-flex justify-center items-center">
          {successMessage}
        </div>
      )}
    </form>
  );
}
