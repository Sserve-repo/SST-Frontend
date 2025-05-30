import { apiRequest } from "@/hooks/use-api"

export interface Booking {
    id: number
    order_id: number
    user_id: number
    artisan_id: number
    service_listing_detail_id: number
    currency: string
    price: number
    booked_date: string
    booked_time: string
    booked_time_to: string
    booking_status: string
    status: string
    created_at: string
    updated_at: string
    service_detail: {
        id: number
        title: string
        service_category_id: number
        service_category: {
            id: number
            name: string
        }
    }
    customer: {
        id: number
        firstname: string
        lastname: string
        email: string
    }
    artisan: {
        id: number
        firstname: string
        lastname: string
        email: string
    }
    order: {
        id: number
        order_no: string
        total: string
        vendor_tax: string
        cart_total: string
    }
}

export interface BookingListResponse {
    orders: Booking[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    TotalExpenditure: string
    completedService: number
    pendingService: number
    serviceInProgress: number
    cancelledService: number
}

export interface BookingDetailResponse {
    id: number
    order_id: number
    user_id: number
    artisan_id: number
    service_listing_detail_id: number
    currency: string
    price: number
    booked_date: string
    booked_time: string
    booked_time_to: string
    booking_status: string
    status: string
    created_at: string
    updated_at: string
    customer_name: string
    service_listing_name: string
    service_category: string
    service_subcategory: string
    order: {
        id: number
        order_no: string
        user_id: number
        total: string
        vendor_tax: string
        shipping_cost: string
        cart_total: string
        order_type: string
        status: string
        created_at: string
        updated_at: string
    }
}

export async function getBookings(params?: {
    status?: string
    booking_status?: string
    search?: string
}) {
    const queryParams = new URLSearchParams()

    if (params?.status) queryParams.append("status", params.status)
    if (params?.booking_status) queryParams.append("booking_status", params.booking_status)
    if (params?.search) queryParams.append("search", params.search)

    const endpoint = `/admin/dashboard/serviceBooking/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    return apiRequest<BookingListResponse>(endpoint)
}

export async function getBookingById(id: string) {
    return apiRequest<BookingDetailResponse>(`/admin/dashboard/serviceBooking/view/${id}`)
}

export async function cancelBooking(id: string) {
    return apiRequest<any>(`/admin/dashboard/serviceBooking/cancel/${id}`, {
        method: "POST",
    })
}

export async function approveBooking(id: string) {
    return apiRequest<any>(`/admin/dashboard/serviceBooking/approve/${id}`, {
        method: "POST",
    })
}

export async function completeBooking(id: string) {
    return apiRequest<any>(`/admin/dashboard/serviceBooking/markAsCompleted/${id}`, {
        method: "POST",
    })
}

export async function rescheduleBooking(id: string, formData: FormData) {
    return apiRequest<any>(`/admin/dashboard/serviceBooking/reschedule/${id}`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}
