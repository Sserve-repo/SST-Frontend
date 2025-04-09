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

export interface AnalyticsData {
  revenue: any;
  users: any;
  engagement: unknown;
  overview: OverviewMetrics;
  traffic?: TrafficData;
  services: ServicesAnalytics | any;
  earnings?: EarningsData;
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
