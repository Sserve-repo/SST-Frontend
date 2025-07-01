import { apiRequest } from "@/hooks/use-api"

export interface OrderItem {
    id: number
    order_id: number
    user_id: number
    local_id: string
    vendor_id: number
    product_listing_detail_id: number
    quantity: number
    currency: string
    unit_price: number
    total_amount: string
    order_status: string
    status: string
    created_at: string
    updated_at: string
    vendor_name: string
    vendor_email: string
    product_name: string
    product_category: string
    product_image?: string
    product_description?: string
}

export interface Order {
    id: number
    order_no: string
    user_id: number
    total: string
    vendor_tax: string
    customer: {
        id: number
        firstname: string
        lastname: string
        email: string
        phone?: string
        user_photo?: string
    }
    shipping_cost: string
    cart_total: string
    order_type: string
    status: string
    created_at: string
    updated_at: string
    product_items: OrderItem[]
}

export interface OrderListResponse {
    orders: Order[]
    TotalExpenditure: string
    deliveredOrder: number
    pendingOrder: number
    orderInProgress: number
    cancelledOrder: number
}

export interface OrderDetailResponse {
    "Order Details": {
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
        product_items: OrderItem[]
        customer: {
            id: number
            firstname: string
            lastname: string
            email: string
            phone?: string
            user_photo?: string
        }
        delivery_information: {
            id: number
            user_id: number
            firstname: string
            lastname: string
            address: string
            city: string
            province_id: number
            postal_code: string
            status: string
            created_at: string
            updated_at: string
        }
    }
}

export async function getOrders(params?: {
    status?: string
    order_status?: string
    search?: string
}) {
    const queryParams = new URLSearchParams()

    if (params?.status) queryParams.append("status", params.status)
    if (params?.order_status) queryParams.append("order_status", params.order_status)
    if (params?.search) queryParams.append("search", params.search)

    const endpoint = `/admin/dashboard/productOrder/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    return apiRequest<OrderListResponse>(endpoint)
}

export async function getOrderById(id: string) {
    return apiRequest<OrderDetailResponse>(`/admin/dashboard/productOrder/view/${id}`)
}
