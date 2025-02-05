import { Users, Package, Clock, XCircle, DollarSign, Hammer, ShoppingCart } from "lucide-react"
import type { MetricDisplay } from "@/types/order"
import type { UserType } from "@/types/order"

export function createMetricDisplay(
    value: number | string,
    trend: number,
    label: string,
    icon: MetricDisplay["icon"],
    color: { text: string; bg: string },
): MetricDisplay {
    return {
        value,
        trend,
        trendText: "vs. last month",
        icon,
        label,
        color,
    }
}

interface MetricsData {
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    cancelledOrders: number
    totalCustomers?: number
    totalEarnings?: number
    averageOrderValue?: number
    customOrdersReceived?: number
    customOrdersCompleted?: number
}

export function generateMetrics(data: MetricsData, userType: UserType) {
    // Base metrics for all roles
    const baseMetrics = {
        totalOrders: createMetricDisplay(data.totalOrders, 12.5, "Total Orders", Package, {
            text: "text-purple-500",
            bg: "bg-purple-50",
        }),
        completedOrders: createMetricDisplay(data.completedOrders, 8.2, "Completed Orders", Clock, {
            text: "text-emerald-500",
            bg: "bg-emerald-50",
        }),
        pendingOrders: createMetricDisplay(data.pendingOrders, -2.1, "Pending Orders", Clock, {
            text: "text-orange-500",
            bg: "bg-orange-50",
        }),
        cancelledOrders: createMetricDisplay(data.cancelledOrders, -5.4, "Cancelled Orders", XCircle, {
            text: "text-red-500",
            bg: "bg-red-50",
        }),
    }

    // Add vendor metrics
    if ((userType === "3" || userType === "4") && data.totalCustomers !== undefined && data.totalEarnings !== undefined) {
        return {
            ...baseMetrics,
            totalCustomers: createMetricDisplay(data.totalCustomers, 4.3, "Total Customers", Users, {
                text: "text-blue-500",
                bg: "bg-blue-50",
            }),
            totalEarnings: createMetricDisplay(data.totalEarnings, 8.2, "Total Earnings", DollarSign, {
                text: "text-green-500",
                bg: "bg-green-50",
            }),
            averageOrderValue: createMetricDisplay(data.averageOrderValue || 0, 6.7, "Average Order Value", ShoppingCart, {
                text: "text-indigo-500",
                bg: "bg-indigo-50",
            }),
        }
    }

    // Add artisan metrics
    if (userType === "4" && data.customOrdersReceived !== undefined) {
        return {
            ...baseMetrics,
            totalCustomers: createMetricDisplay(data.totalCustomers || 0, 4.3, "Total Customers", Users, {
                text: "text-blue-500",
                bg: "bg-blue-50",
            }),
            totalEarnings: createMetricDisplay(data.totalEarnings || 0, 8.2, "Total Earnings", DollarSign, {
                text: "text-green-500",
                bg: "bg-green-50",
            }),
            averageOrderValue: createMetricDisplay(data.averageOrderValue || 0, 6.7, "Average Order Value", ShoppingCart, {
                text: "text-indigo-500",
                bg: "bg-indigo-50",
            }),
            customOrdersReceived: createMetricDisplay(data.customOrdersReceived, 15.7, "Custom Orders Received", Hammer, {
                text: "text-pink-500",
                bg: "bg-pink-50",
            }),
            customOrdersCompleted: createMetricDisplay(
                data.customOrdersCompleted || 0,
                12.3,
                "Custom Orders Completed",
                Hammer,
                { text: "text-cyan-500", bg: "bg-cyan-50" },
            ),
        }
    }

    return baseMetrics
}

