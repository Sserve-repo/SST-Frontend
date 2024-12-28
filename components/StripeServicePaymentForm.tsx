"use client";

import { useCallback, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { confirmServicePaymentPayload } from "@/forms/checkout";
import { confirmServicePayment } from "@/actions/checkout";
import { useRouter } from "next/navigation";
import { usePaymentProvider } from "@/context/PaymentContext ";
import { PaymentSuccess } from "./PaymentSuccess";

type StripeServicePaymentFormProps = {
  onSuccess: (e: React.FormEvent) => void;
  checkoutData: any;
};
export function StripeServicePaymentForm({
  onSuccess,
  checkoutData,
}: StripeServicePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = usePaymentProvider();
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
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
      const payload = confirmServicePaymentPayload(data_);
      const response = await confirmServicePayment(payload);
      const data = await response.json();

      if (response.ok) {
        onSuccess(event);
        setIsLoading(false);
        setSuccessMessage("Payment Successful...");
        localStorage.removeItem("formData");

        setTimeout(() => {
          router.push("/");
        }, 3500);
        
      } else {
        setErrorMessage(`An error occured......,${data.data}`);
        setIsLoading(false);
      }
    },
    [stripe, elements, checkoutData, formData, onSuccess, router]
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
