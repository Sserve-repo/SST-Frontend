export interface Promotion {
  id: string
  name: string
  type: "percentage" | "fixed_amount"
  value: number
  startDate: Date
  endDate: Date
  status: "active" | "expired" | "upcoming" | "disabled"
  usageLimit: number
  usageCount: number
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface PromotionFormData {
  discount_name: string
  discount_type: "percentage" | "fixed_amount"
  discount_value: number
  start_date: string
  end_date: string
  usage_limit: number
  description: string
  status: "active" | "inactive";
}

export interface PromotionStats {
  all: number
  active: number
  expired: number
  upcoming: number
}

export interface PromotionFilters {
  status?: string
  search?: string
  dateRange?: {
    from: Date
    to: Date
  }
}
