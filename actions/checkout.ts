import { baseUrl } from "../config/constant";
import Cookies from "js-cookie";

// Function to make a payment via your backend
export const createPaymentIntent = async () => {
    const token = Cookies.get("accessToken");
    try {
        const form = new FormData();
        form.append("paymentMethodId", "pm_card_mastercard");
        form.append("amount", "pm_card_mastercard");
        const response = await fetch(`${baseUrl}/general/checkout/createProductPayment`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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



// Function to make a payment via your backend
export const createServicePaymentIntent = async (listingId: string) => {
    const token = Cookies.get("accessToken");
    try {
        const form = new FormData();
        form.append("paymentMethodId", "pm_card_mastercard");
        form.append("listingId", `${listingId}`)
        const response = await fetch(`${baseUrl}/general/checkout/createServicePayment`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
    const token = Cookies.get("accessToken")

    const response = await fetch(
        `${baseUrl}/general/checkout/confirmProductPayment`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
        }
    );
    return response;

};


export const confirmServicePayment = async (form) => {
    const token = Cookies.get("accessToken")
    const response = await fetch(
        `${baseUrl}/general/checkout/confirmServicePayment`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
        }
    );
    return response;

};