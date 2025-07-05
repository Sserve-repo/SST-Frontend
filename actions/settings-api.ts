import { baseUrl } from "@/config/constant"
import Cookies from "js-cookie";
import type {
    ServiceAreaAvailabilityData,
    BusinessPolicyData,
    ShippingPolicyData,
    VendorIdentityData,
    BusinessDetailsData,
    ServiceAreaAvailability,
    BusinessPolicy,
    ShippingPolicy,
    VendorIdentity,
    BusinessDetails,
} from "@/types/settings"

// Helper to get token
function getAuthToken(): string | null {
    return Cookies.get("accessToken") || null;
}

// Service Area Availability (Artisan)
export async function updateServiceAreaAvailability(data: ServiceAreaAvailabilityData): Promise<{
    data: ServiceAreaAvailability | null
    token: string | null
    error: string | null
}> {
    try {
        const token = getAuthToken();

        if (!token) {
            return { data: null, token: null, error: "No authentication token found" }
        }

        const formData = new FormData()
        // Fix: Send as JSON string as shown in the API example
        formData.append("available_dates", JSON.stringify(data.available_dates))
        formData.append("start_time", data.start_time)
        formData.append("end_time", data.end_time)
        formData.append("longitude", data.longitude)
        formData.append("latitude", data.latitude)
        formData.append("home_service_availability", data.home_service_availability)
        if (data.service_duration) {
            formData.append("service_duration", data.service_duration)
        }

        const response = await fetch(`${baseUrl}/artisan/dashboard/settings/updateServiceAreaAvailability`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
            return { data: null, token: null, error: result.message || "Failed to update service area availability" }
        }

        if (result.status && result.data) {
            return {
                data: result.data["Service Area"],
                token: result.data.token,
                error: null,
            }
        }

        return { data: null, token: null, error: "Invalid response format" }
    } catch (error) {
        console.error("Error updating service area availability:", error)
        return { data: null, token: null, error: "Network error occurred" }
    }
}

// Business Policy (Artisan)
export async function updateBusinessPolicy(data: BusinessPolicyData): Promise<{
    data: BusinessPolicy | null
    token: string | null
    error: string | null
}> {
    try {
        const token = getAuthToken();

        if (!token) {
            return { data: null, token: null, error: "No authentication token found" }
        }

        const formData = new FormData()
        formData.append("booking_details", data.booking_details)
        formData.append("cancelling_policy", data.cancelling_policy)

        const response = await fetch(`${baseUrl}/artisan/dashboard/settings/updateBusinessPolicy`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
            return { data: null, token: null, error: result.message || "Failed to update business policy" }
        }

        if (result.status && result.data) {
            return {
                data: result.data.shippingPolicy, // Note: API returns "shippingPolicy" for business policy
                token: result.data.token,
                error: null,
            }
        }

        return { data: null, token: null, error: "Invalid response format" }
    } catch (error) {
        console.error("Error updating business policy:", error)
        return { data: null, token: null, error: "Network error occurred" }
    }
}

// Shipping Policy (Vendor)
export async function updateShippingPolicy(data: ShippingPolicyData & { user_email: string }): Promise<{
    data: ShippingPolicy | null
    token: string | null
    error: string | null
}> {
    try {
        const token = getAuthToken();

        if (!token) {
            return { data: null, token: null, error: "No authentication token found" }
        }

        const formData = new FormData()
        formData.append("user_email", data.user_email)
        formData.append("shipping_option", data.shipping_option)
        formData.append("from_day", data.from_day)
        formData.append("to_day", data.to_day)
        formData.append("return_policy", data.return_policy)
        formData.append("shipping_cost", data.shipping_cost)

        const response = await fetch(`${baseUrl}/vendor/dashboard/settings/updateShippingPolicy`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
            return { data: null, token: null, error: result.message || "Failed to update shipping policy" }
        }

        if (result.status && result.data) {
            return {
                data: result.data.shippingPolicy,
                token: result.data.token,
                error: null,
            }
        }

        return { data: null, token: null, error: "Invalid response format" }
    } catch (error) {
        console.error("Error updating shipping policy:", error)
        return { data: null, token: null, error: "Network error occurred" }
    }
}

// Vendor Identity (Vendor)
export async function updateVendorIdentity(data: VendorIdentityData): Promise<{
    data: VendorIdentity | null
    token: string | null
    error: string | null
}> {
    try {
        const token = getAuthToken();

        if (!token) {
            return { data: null, token: null, error: "No authentication token found" }
        }

        const formData = new FormData()
        formData.append("document_type", data.document_type)
        formData.append("document", data.document)

        const response = await fetch(`${baseUrl}/vendor/dashboard/settings/updateVendorIdentity`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
            return { data: null, token: null, error: result.message || "Failed to update vendor identity" }
        }

        if (result.status && result.data) {
            return {
                data: result.data.vendorIdentity,
                token: result.data.token,
                error: null,
            }
        }

        return { data: null, token: null, error: "Invalid response format" }
    } catch (error) {
        console.error("Error updating vendor identity:", error)
        return { data: null, token: null, error: "Network error occurred" }
    }
}

// Business Details (Vendor)
export async function updateBusinessDetails(data: BusinessDetailsData): Promise<{
    data: BusinessDetails | null
    token: string | null
    error: string | null
}> {
    try {
        const token = getAuthToken();

        if (!token) {
            return { data: null, token: null, error: "No authentication token found" }
        }

        const formData = new FormData()
        formData.append("business_details", data.business_details)
        formData.append("business_email", data.business_email)
        formData.append("business_phone", data.business_phone)
        formData.append("business_name", data.business_name)
        formData.append("product_category_id", data.product_category_id)
        formData.append("product_region_id", data.product_region_id)
        formData.append("city", data.city)
        formData.append("province_id", data.province_id)
        formData.append("postal_code", data.postal_code)

        const response = await fetch(`${baseUrl}/vendor/dashboard/settings/updateBusinessDetails`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
            return { data: null, token: null, error: result.message || "Failed to update business details" }
        }

        if (result.status && result.data) {
            return {
                data: result.data.businessDetails,
                token: result.data.token,
                error: null,
            }
        }

        return { data: null, token: null, error: "Invalid response format" }
    } catch (error) {
        console.error("Error updating business details:", error)
        return { data: null, token: null, error: "Network error occurred" }
    }
}
