import { apiRequest } from "@/hooks/use-api"

export interface Overview {
    activeVendors: number
    activeArtisans: number
    activeShoppers: number
    revenueStats: {
        date: string
        total_revenue: string
    }[]
    newUsers: {
        month: number
        total_users: number
    }[]
    totalRevenue: number
    mostBookedServices: {
        service_listing_detail_id: number
        title: string
        total_amount: number
        total_bookings: number
        booking_percentage: number
    }[]
}

export async function getDashboardOverview() {
    return apiRequest<{ Overview: Overview }>(`/admin/dashboard/overview`)
}
