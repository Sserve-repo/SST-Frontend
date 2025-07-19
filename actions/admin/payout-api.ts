import { apiRequest } from "@/hooks/use-api"

export interface PendingPayout {
    user_id: number
    user_name: string
    payout: "product" | "service"
    total_items: number
    total_amount: string
    latest_date: string
}

export interface CompletedPayout {
    user_id: number
    user_name: string
    payout: "product" | "service"
    total_items: number
    total_amount: string
    latest_date: string
}

// These interfaces represent the full API response structure
export interface PendingPayoutResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        data: {
            totalPendingPayout: number
            totalCompletedPayout: number
            pendingPayouts: PendingPayout[]
        }
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    token: null
    debug: null
}

export interface CompletedPayoutResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        current_page: number
        last_page: number
        per_page: number
        total: number
        completedPayouts: CompletedPayout[]
    }
    token: null
    debug: null
}

export interface ProcessPayoutResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        payout: {
            id: number
            user_id: string
            total_amount: number
            method: string
            status: string
            paid_at: string
            created_at: string
            updated_at: string
        }
    }
    token: null
    debug: null
}

// These interfaces represent what apiRequest actually returns (just the data property)
interface PendingPayoutData {
    pendingPayouts: PendingPayout[]
    totalPendingPayout: number
    totalCompletedPayout: number
    current_page: number
    last_page: number
    per_page: number
    total: number
}

interface CompletedPayoutData {
    current_page: number
    last_page: number
    per_page: number
    total: number
    completedPayouts: CompletedPayout[]
}

interface ProcessPayoutData {
    payout: {
        id: number
        user_id: string
        total_amount: number
        method: string
        status: string
        paid_at: string
        created_at: string
        updated_at: string
    }
}

export async function getPendingPayouts() {
    try {
        const response = await apiRequest<PendingPayoutData>("/admin/dashboard/payout/pendingPayout")
        return {
            data: response.data,
            error: response.error,
        }
    } catch (error) {
        console.error("Error fetching pending payouts:", error)
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to fetch pending payouts",
        }
    }
}

export async function getCompletedPayouts() {
    try {
        const response = await apiRequest<CompletedPayoutData>("/admin/dashboard/payout/completedPayout")
        return {
            data: response.data,
            error: response.error,
        }
    } catch (error) {
        console.error("Error fetching completed payouts:", error)
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to fetch completed payouts",
        }
    }
}

export async function processPayout(userId: number) {
    try {
        const formData = new FormData()
        formData.append("user_id", userId.toString())

        console.log("Processing payout for user ID:", userId)

        const response = await apiRequest<ProcessPayoutData>("/admin/dashboard/payout/processPayout", {
            method: "POST",
            body: formData,
            isFormData: true,
        })

        console.log("Processing payout response:", response)

        return {
            data: response.data,
            error: response.error,
        }
    } catch (error) {
        console.error("Error processing payout:", error)
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to process payout",
        }
    }
}
