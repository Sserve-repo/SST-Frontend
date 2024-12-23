"use client";

import { useCallback, useState } from "react";
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
import { usePaymentProvider } from "@/context/PaymentContext ";
import { PaymentSuccess } from "./PaymentSuccess";

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
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { formData } = usePaymentProvider();

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      console.log("data********", formData)
      event.preventDefault();
      setIsLoading(true);

      const data_ = {
        ...checkoutData,
        ...formData,
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
        setSuccessMessage("Payment Successful...");
        localStorage.removeItem("formData");

        clearCart();
        console.log("response....", data);
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setErrorMessage(`An error occured......,${data.data}`);
        setIsLoading(false);
      }
    },
    [stripe, elements, clearCart, checkoutData, onSuccess, router, formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      {!successMessage && (
        <div>
          <PaymentElement />
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full mt-4"
          >
            {isLoading ? "Processing..." : "Pay now"}
          </Button>
        </div>
      )}
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <div>{successMessage && <PaymentSuccess />}</div>
    </form>
  );
}
