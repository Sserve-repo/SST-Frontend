export type PromotionType = "percentage" | "fixed";
export type PromotionStatus = "active" | "upcoming" | "expired";

export interface Promotion {
  id: string;
  code: string;
  type: PromotionType;
  value: number;
  startDate: Date ;
  endDate: Date ;
  status: PromotionStatus;
  usageLimit: number;
  usageCount: number;
  description: string;
}
