import Stripe from "stripe";
import { baseUrl } from "../config/constant";

// Function to make a payment via your backend
export const createProductPayment = async () => {
    const form = new FormData();
    form.append("paymentMethodId", "pm_card_mastercard");

    try {
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

        if (!response.ok) {
            throw new Error(`Payment failed with status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Failed to make product payment:", error);
        throw error;
    }
};

// Initialize Stripe
console.log("process.env.STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
});

// Function to create a payment intent via Stripe
export async function createStripePaymentIntent() {
    try {
        // Calculate the order amount (replace with your actual calculation logic)
        const amount = 1000; // Example: $10.00 in cents

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            // Add additional options if needed
        });

        return new Response(
            JSON.stringify({ clientSecret: paymentIntent.client_secret }),
            {
                headers: { "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return new Response(
            JSON.stringify({ error: "Error creating payment intent" }),
            {
                headers: { "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
}
