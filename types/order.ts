import type { LucideIcon } from "lucide-react"
import type React from "react"

// Role-based types
export type UserType = "2" | "3" | "4" // 2=Shopper, 3=Vendor, 4=Artisan

export type OrderStatus = "pending" | "in-transit" | "delivered" | "cancelled"

// Base types
export interface OrderItem {
    id: string
    name: string
    quantity: number
    price: number
    image_url?: string
    sku: string
}

export interface ShippingAddress {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
}

export interface PaymentMethod {
    type: "credit_card" | "paypal" | "bank_transfer"
    last4?: string
}

export interface CustomOrderSpecs {
    specifications: string
    timeline: string
    materials: string[]
    reference_images?: string[]
    estimated_completion_date: string
}

export interface OrderActivity {
    id: string
    type: "status_change" | "note" | "payment" | "shipping"
    message: string
    date: string
    user: {
        id: string
        name: string
        type: UserType
    }
}

// Metrics types
export interface MetricData {
    value: number | string
    trend: number
    trendText: string
    icon: LucideIcon
    label: string
    color: {
        text: string
        bg: string
    }
}

export interface BaseMetrics {
    totalOrders: MetricData
    completedOrders: MetricData
    pendingOrders: MetricData
    cancelledOrders: MetricData
}

export interface VendorMetrics extends BaseMetrics {
    totalCustomers: MetricData
    totalEarnings: MetricData
    averageOrderValue: MetricData
}

export interface ArtisanMetrics extends VendorMetrics {
    customOrdersReceived: MetricData
    customOrdersCompleted: MetricData
}

export type RoleMetrics = BaseMetrics | VendorMetrics | ArtisanMetrics

// Order type with proper discriminated union for custom orders
export interface BaseOrder {
    id: string
    orderNo: string
    date: string
    items: OrderItem[]
    subtotal: number
    tax: number
    shipping: number
    total: number
    status: OrderStatus
    activities: OrderActivity[]
    shippingAddress: ShippingAddress
    paymentMethod: PaymentMethod
    notes?: string
}

export interface StandardOrder extends BaseOrder {
    isCustomOrder: false
    customerId: string
    customerName: string
    vendorId: string
    vendorName: string
}

export interface CustomOrder extends BaseOrder {
    isCustomOrder: true
    customerId: string
    customerName: string
    artisanId: string
    artisanName: string
    customOrderSpecs: CustomOrderSpecs
}

export type Order = StandardOrder | CustomOrder

// Component props types
export interface OrderFilters {
    dateRange?: {
        from: Date
        to: Date
    }
    status?: OrderStatus
    isCustomOrder?: boolean
    search?: string
}

export interface OrderSort {
    field: keyof Order
    direction: "asc" | "desc"
}

export interface OrderTableColumn {
    key: string
    label: string
    sortable?: boolean
    render?: (order: Order) => React.ReactNode
}

export interface OrdersPageProps {
    userType: UserType
}

export interface OrderDetailsProps {
    isOpen: boolean
    onClose: () => void
    order: Order
    userType: UserType
    onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
    onAcceptOrder: (orderId: string) => Promise<void>
    onRejectOrder: (orderId: string) => Promise<void>
    isLoading?: boolean
}

export interface RoleMetricsProps {
    metrics: RoleMetrics
    userType: UserType
    isLoading?: boolean
}

export interface OrderTableProps {
    orders: Order[]
    userType: UserType
    onViewDetails: (order: Order) => void
    isLoading?: boolean
    sort?: OrderSort
    onSort?: (sort: OrderSort) => void
}

export interface OrderActionsProps {
    order: Order
    userType: UserType
    onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
    onAcceptOrder: (orderId: string) => Promise<void>
    onRejectOrder: (orderId: string) => Promise<void>
    isLoading?: boolean
}

export interface EarningsChartData {
    month: string
    pending: number
    completed: number
}

export interface EarningsChartProps {
    data: EarningsChartData[]
    total: string
    trend: {
        value: number
        text: string
    }
    isLoading?: boolean
}

export interface MetricDisplay {
    value: number | string
    trend: number
    trendText: string
    icon: LucideIcon
    label: string
    color: {
        text: string
        bg: string
    }
}

// Base metrics that all roles can see
export interface BaseOrderMetrics {
    totalOrders: MetricDisplay
    completedOrders: MetricDisplay
    pendingOrders: MetricDisplay
    cancelledOrders: MetricDisplay
    totalCustomers: MetricDisplay
    ordersInTransit: MetricDisplay
    totalDelivered: MetricDisplay

}
// Additional metrics for vendors
export interface VendorMetrics extends BaseOrderMetrics {
    // totalCustomers: MetricDisplay
    totalEarnings: MetricDisplay
    averageOrderValue: MetricDisplay
}

// Additional metrics for artisans
export interface ArtisanMetrics extends VendorMetrics {
    customOrdersReceived: MetricDisplay
    customOrdersCompleted: MetricDisplay
}

// Union type for all possible metrics
export type OrderMetrics = BaseOrderMetrics | VendorMetrics | ArtisanMetrics

// Type guard to check if metrics include vendor-specific data
export function isVendorMetrics(metrics: OrderMetrics): metrics is VendorMetrics {
    return "totalCustomers" in metrics && "totalEarnings" in metrics
}

// Type guard to check if metrics include artisan-specific data
export function isArtisanMetrics(metrics: OrderMetrics): metrics is ArtisanMetrics {
    return "customOrdersReceived" in metrics && "customOrdersCompleted" in metrics
}

