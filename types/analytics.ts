export interface OverviewMetrics {
    totalBookings: number
    totalRevenue: number
    averageRating: number
    conversionRate: number
}

export interface TrafficSource {
    source: string
    value: number
}

export interface DailyTraffic {
    date: Date
    visitors: number
    pageViews: number
}

export interface TrafficData {
    pageViews: number
    uniqueVisitors: number
    sources: TrafficSource[]
    dailyVisitors: DailyTraffic[]
}

export interface ServiceData {
    name: string
    bookings: number
    revenue: number
}

export interface ServicesAnalytics {
    totalServices: number
    activeServices: number
    serviceBreakdown: ServiceData[]
}

export interface MonthlyEarnings {
    month: string
    earnings: number
}

export interface EarningsData {
    total: number
    pending: number
    paid: number
    monthly: MonthlyEarnings[]
}

export interface AnalyticsData {
    overview: OverviewMetrics
    traffic: TrafficData
    services: ServicesAnalytics
    earnings: EarningsData
}

