export interface Promotion {
  id: string
  name: string
  code?: string
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
  totalSavings?: number
  conversionRate?: number
  ty
}

export interface PromotionFormData {
  discount_name: string
  discount_type: "percentage" | "fixed_amount"
  discount_value: number
  start_date: string
  end_date: string
  usage_limit: number
  description: string
  status: "active" | "inactive"
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

export interface PromotionResponse {
  status: boolean
  status_code: number
  message: string
  data: {
    all: {
      count: number
      all_discounts: RawPromotion[]
    }
    active: {
      count: number
      discounts: RawPromotion[]
    }
    expired: {
      count: number
      discounts: RawPromotion[]
    }
    upcoming: {
      count: number
      discounts: RawPromotion[]
    }
  }
  token: null
  debug: null
}

export interface RawPromotion {
  id: number
  artisan_id: number
  discount_name: string
  discount_type: "percentage" | "fixed_amount"
  discount_value: string
  start_date: string
  end_date: string
  status: string
  description: string
  usage_limit: number
  usage_count?: number
  created_at: string
  updated_at: string
}
