export interface OverviewMetrics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  conversionRate: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
}

export interface TrafficSource {
  source: string;
  value: number;
}

export interface DailyTraffic {
  date: Date;
  visitors: number;
  pageViews: number;
}

export interface TrafficData {
  pageViews: number;
  uniqueVisitors: number;
  sources: TrafficSource[];
  dailyVisitors: DailyTraffic[];
}

export interface ServiceData {
  name?: string;
  bookings?: number;
  revenue?: number;
}

export interface ServicesAnalytics {
  totalServices?: number;
  activeServices?: number;
  serviceBreakdown?: ServiceData[];
}

export interface MonthlyEarnings {
  month: string;
  earnings: number;
}

export interface EarningsData {
  total: number;
  pending: number;
  paid: number;
  monthly: MonthlyEarnings[];
}

export interface SalesAnalyticsData {
  revenue?: Array<{
    month: number;
    total_revenue: string | number;
  }>;
  revenueStats?: Array<{
    month: number;
    total_revenue: string | number;
  }>;
  orderTrends?: Array<{
    month: number;
    total_orders: string | number;
  }>;
  topProducts?: Array<{
    product_name: string;
    total_sold: string | number;
    month: number;
  }>;
}

export interface AnalyticsData {
  revenue?: SalesAnalyticsData['revenue'];
  users?: unknown;
  engagement?: unknown;
  overview: OverviewMetrics;
  traffic?: TrafficData;
  services: ServicesAnalytics;
  earnings?: EarningsData;
  orderTrends?: SalesAnalyticsData['orderTrends'];
  topProducts?: SalesAnalyticsData['topProducts'];
}

export type RevenueData = {
  growth: number; // percentage growth compared to last month, e.g. 5 or -3
  monthly: {
    month: string; // e.g. "Jan", "Feb", etc.
    revenue: number; // e.g. 12000
  }[];
};

export type UserData = {
  growth: number;
  monthly: {
    month: string; 
    users: number; 
  }[];
};
