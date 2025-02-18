import { format } from "date-fns"
import { Users, Package, Clock, XCircle, DollarSign, ShoppingCart, LucideIcon } from "lucide-react"

import type {
    OrderStatus,
    UserType,
    OrderTableColumn,
    Order,
    MetricData,
    RoleMetrics,
    CustomOrder,
} from "@/types/order"

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
    pending: {
        label: "Pending",
        color: "bg-purple-100 text-purple-700",
    },
    "in-transit": {
        label: "In Transit",
        color: "bg-blue-100 text-blue-700",
    },
    delivered: {
        label: "Delivered",
        color: "bg-emerald-100 text-emerald-700",
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-700",
    },
}

export const getTableColumns = (userType: UserType): OrderTableColumn[] => {
    const baseColumns: OrderTableColumn[] = [
        {
            key: "orderNo",
            label: "ORDER ID",
            sortable: true,
            render: (order) => `#${order.orderNo}`,
        },
        {
            key: "date",
            label: "DATE",
            sortable: true,
            render: (order) => formatDate(order.date),
        },
        {
            key: "total",
            label: "TOTAL",
            sortable: true,
            render: (order) => formatCurrency(order.total),
        },
        {
            key: "status",
            label: "STATUS",
            sortable: true,
            render: (order) => ORDER_STATUS_MAP[order.status].label,
        },
    ]

    switch (userType) {
        case "2": // Shopper
            return [
                ...baseColumns,
                {
                    key: "vendorName",
                    label: "VENDOR",
                    sortable: true,
                    render: (order) => (!order.isCustomOrder ? order.vendorName : "N/A"),
                },
            ]
        case "3": // Vendor
            return [
                ...baseColumns,
                {
                    key: "customerName",
                    label: "CUSTOMER",
                    sortable: true,
                    render: (order) => order.customerName,
                },
            ]
        case "4": // Artisan
            return [
                ...baseColumns,
                {
                    key: "customerName",
                    label: "CUSTOMER",
                    sortable: true,
                    render: (order) => order.customerName,
                },
                {
                    key: "isCustomOrder",
                    label: "ORDER TYPE",
                    sortable: true,
                    render: (order) => (order.isCustomOrder ? "Custom" : "Standard"),
                },
            ]
        default:
            return baseColumns
    }
}

export const formatDate = (date: string | null | undefined): string => {
    if (!date) return "N/A" 
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return "Invalid Date" 
    return format(parsedDate, "MM, dd, yyyy")
}
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

export const createMetricData = (
    value: number | string,
    trend: number,
    label: string,
    icon: LucideIcon,
    color: { text: string; bg: string },
): MetricData => ({
    value,
    trend,
    trendText: "vs. last month",
    icon,
    label,
    color,
})

export const getBaseMetrics = (data: {
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    cancelledOrders: number
    totalCustomers?: number
    totalEarnings?: number
    averageOrderValue?: number
    customOrdersReceived?: number
    customOrdersCompleted?: number
}): RoleMetrics => {
    const baseMetrics = {
        totalOrders: createMetricData(data.totalOrders, 12.5, "Total Orders", Package, {
            text: "text-purple-500",
            bg: "bg-purple-50",
        }),
        completedOrders: createMetricData(data.completedOrders, 8.2, "Completed Orders", Clock, {
            text: "text-emerald-500",
            bg: "bg-emerald-50",
        }),
        pendingOrders: createMetricData(data.pendingOrders, -2.1, "Pending Orders", Clock, {
            text: "text-orange-500",
            bg: "bg-orange-50",
        }),
        cancelledOrders: createMetricData(data.cancelledOrders, -5.4, "Cancelled Orders", XCircle, {
            text: "text-red-500",
            bg: "bg-red-50",
        }),
    }

    if (data.totalCustomers !== undefined && data.totalEarnings !== undefined) {
        return {
            ...baseMetrics,
            totalCustomers: createMetricData(data.totalCustomers, 4.3, "Total Customers", Users, {
                text: "text-blue-500",
                bg: "bg-blue-50",
            }),
            totalEarnings: createMetricData(formatCurrency(data.totalEarnings), 8.2, "Total Earnings", DollarSign, {
                text: "text-green-500",
                bg: "bg-green-50",
            }),
            averageOrderValue: createMetricData(
                formatCurrency(data.averageOrderValue || 0),
                6.7,
                "Average Order Value",
                ShoppingCart,
                { text: "text-indigo-500", bg: "bg-indigo-50" },
            ),
        }
    }

    return baseMetrics
}

export const isCustomOrder = (order: Order): order is CustomOrder => {
    return order.isCustomOrder === true
}

