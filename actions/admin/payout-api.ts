import { apiRequest } from "@/hooks/use-api"

export interface PendingPayout {
    vendor_id?: number
    artisan_id?: number
    vendor_name?: string
    artisan_name?: string
    type: "product" | "service"
    total_orders?: number
    total_bookings?: number
    total_amount: number
    latest_order_date?: string
    latest_booking_date?: string
}

export interface CompletedPayout {
    vendor_id?: number
    artisan_id?: number
    vendor_name?: string
    artisan_name?: string
    type: "product" | "service"
    total_orders?: number
    total_bookings?: number
    total_amount: number
    latest_order_date?: string
    latest_booking_date?: string
}

export interface PendingPayoutResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        Payout: {
            totalPendingPayout: number
            totalCompletedPayout: number
            allPending: PendingPayout[]
        }
    }
    token: null
    debug: null
}

export interface CompletedPayoutResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        Payout: {
            allCompleted: CompletedPayout[]
        }
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

export async function getPendingPayouts() {
    try {
        const response = await apiRequest<PendingPayoutResponse>("/admin/dashboard/payout/pendingPayout")
        return {
            data: response,
            error: null,
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
        const response = await apiRequest<CompletedPayoutResponse>("/admin/dashboard/payout/completedPayout")
        return {
            data: response,
            error: null,
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

        const response = await apiRequest<ProcessPayoutResponse>("/admin/dashboard/payout/processPayout", {
            method: "POST",
            body: formData,
        })

        return {
            data: response,
            error: null,
        }
    } catch (error) {
        console.error("Error processing payout:", error)
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to process payout",
        }
    }
}
