import Stripe from "stripe";
import { baseUrl } from "../config/constant";

// Function to make a payment via your backend
export const createPaymentIntent = async () => {
    try {
        const form = new FormData();
        form.append("paymentMethodId", "pm_card_mastercard");
        form.append("amount", "pm_card_mastercard");

        const response = await fetch(
            `${baseUrl}/general/checkout/createProductPayment`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage
                        .getItem("accessToken")
                        ?.replaceAll('"', "")}`,
                },
                method: "POST",
                body: form,
            }
        );

        return response;
    } catch (error) {
        console.error("Failed to make product payment:", error);
        throw error;
    }
};



export const confirmPayment = async (form) => {
    const response = await fetch(
        `${baseUrl}/general/checkout/confirmProductPayment`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")?.replaceAll('"', "")}`,
            },
            body: form,
        }
    );
    return response;

};