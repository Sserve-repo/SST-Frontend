export type Campaign = {
  id: string;
  name: string;
  description: string;
  performance?: {
    ctr: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    impressions: number;
  };
  dailyPerformance?: {
    date: string;
    impressions: number;
    conversions: number;
    revenue: number;
  }[];
  status: "active" | "scheduled" | "completed" | "paused" | "draft";
  discount: {
    type: "percentage" | "amount";
    value: number;
  };
  startDate: string;
  endDate: string;
  targetAudience: string[];
  type: string;
};
