import { baseUrl } from "../config/constant";
import Cookies from "js-cookie";

// Interfaces
export interface UserProfile {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    phone: string | null;
    user_photo: string;
    email: string;
    email_verified_at: string | null;
    verified_status: string;
    active_status: number;
    is_completed: string;
    email_status: string;
    twofa_status: string;
    otp: string | null;
    otp_timestamp: string | null;
    registration_status: string | null;
    user_type: string;
    role_id: number | null;
    address: string;
    stripe_customer_id: string | null;
    stripe_payment_method_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdateData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    address: string;
    twofa_status: string;
    email_status: string;
}

export interface BusinessPolicyData {
    booking_details: string;
    cancelling_policy: string;
}

export interface VendorIdentityData {
    document_type: string;
    document: File;
}

export interface BillingDetailsData {
    card_number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    type: string;
}

export interface PaymentMethodData {
    payment_method_id: string;
}

// Helper to get token
function getAuthToken(): string | null {
    return Cookies.get("accessToken") || null;
}

// API functions
export async function getUserProfile(): Promise<{
    data: UserProfile | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, error: "No authentication token found" };

    try {
        const response = await fetch(`${baseUrl}/dashboard/profile/getUserProfile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        console.log("Fetch profile result:", result);
        if (!response.ok) return { data: null, error: result.message || "Failed to fetch profile" };

        return result.status && result.data
            ? { data: result.data, error: null }
            : { data: null, error: "Invalid response format" };
    } catch (error) {
        console.error("Fetch profile error:", error);
        return { data: null, error: "Network error occurred" };
    }
}

export async function updateUserProfile(data: ProfileUpdateData): Promise<{
    data: UserProfile | null;
    token: string | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, token: null, error: "No authentication token found" };

    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetch(`${baseUrl}/dashboard/profile/updateUserProfile`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) return { data: null, token: null, error: result.message || "Failed to update profile" };

        return result.status && result.data
            ? {
                data: result.data["User Details"],
                token: result.data.token || null,
                error: null,
            }
            : { data: null, token: null, error: "Invalid response format" };
    } catch (error) {
        console.error("Update profile error:", error);
        return { data: null, token: null, error: "Network error occurred" };
    }
}

export async function updateUserPhoto(file: File): Promise<{
    data: UserProfile | null;
    token: string | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, token: null, error: "No authentication token found" };

    try {
        const formData = new FormData();
        formData.append("user_photo", file);

        const response = await fetch(`${baseUrl}/dashboard/profile/updateUserPhoto`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) return { data: null, token: null, error: result.message || "Failed to update photo" };

        return result.status && result.data
            ? {
                data: result.data.user,
                token: result.data.token || null,
                error: null,
            }
            : { data: null, token: null, error: "Invalid response format" };
    } catch (error) {
        console.error("Update photo error:", error);
        return { data: null, token: null, error: "Network error occurred" };
    }
}

export async function updateBusinessPolicy(data: BusinessPolicyData): Promise<{
    data: any | null;
    token: string | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, token: null, error: "No authentication token found" };

    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetch(`${baseUrl}/artisan/dashboard/settings/updateBusinessPolicy`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) return { data: null, token: null, error: result.message || "Failed to update business policy" };

        return result.status && result.data
            ? {
                data: result.data.shippingPolicy,
                token: result.data.token || null,
                error: null,
            }
            : { data: null, token: null, error: "Invalid response format" };
    } catch (error) {
        console.error("Update business policy error:", error);
        return { data: null, token: null, error: "Network error occurred" };
    }
}

export async function updateVendorIdentity(data: VendorIdentityData): Promise<{
    data: any | null;
    token: string | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, token: null, error: "No authentication token found" };

    try {
        const formData = new FormData();
        formData.append("document_type", data.document_type);
        formData.append("document", data.document);

        const response = await fetch(`${baseUrl}/vendor/dashboard/settings/updateVendorIdentity`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) return { data: null, token: null, error: result.message || "Failed to update identity" };

        return result.status && result.data
            ? {
                data: result.data.vendorIdentity,
                token: result.data.token || null,
                error: null,
            }
            : { data: null, token: null, error: "Invalid response format" };
    } catch (error) {
        console.error("Update identity error:", error);
        return { data: null, token: null, error: "Network error occurred" };
    }
}

export async function updateBillingDetails(data: BillingDetailsData): Promise<{
    data: any | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, error: "No authentication token found" };

    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetch(`${baseUrl}/dashboard/payment/updateBillingDetail`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) return { data: null, error: result.message || "Failed to update billing details" };

        return { data: result, error: null };
    } catch (error) {
        console.error("Update billing details error:", error);
        return { data: null, error: "Network error occurred" };
    }
}

export async function updatePaymentMethod(data: PaymentMethodData): Promise<{
    data: any | null;
    error: string | null;
}> {
    const token = getAuthToken();
    if (!token) return { data: null, error: "No authentication token found" };

    try {
        const formData = new FormData();
        formData.append("payment_method_id", data.payment_method_id);

        const response = await fetch(`${baseUrl}/dashboard/payment/updateStripePaymentMethod`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) return { data: null, error: result.message || "Failed to update payment method" };

        return { data: result, error: null };
    } catch (error) {
        console.error("Update payment method error:", error);
        return { data: null, error: "Network error occurred" };
    }
}
