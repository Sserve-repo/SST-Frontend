export type ServiceStatus = "active" | "inactive" | "draft" | "pending" | "approved" | "rejected" | "disabled"

export interface Service {
  id: string
  name: string
  title?: string
  description: string
  price: number
  duration: number
  category: string
  status: ServiceStatus
  images: string[]
  availability?: string
  homeService?: boolean
  rating: number
  reviewCount: number
  bookingCount: number
  createdAt: Date | string
  updatedAt: Date
  featured?: boolean
  vendor?: {
    id: string
    name: string
    email: string
  }
}

export interface ServiceAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface ServiceFilters {
  category?: string
  status?: ServiceStatus
  priceRange?: {
    min: number
    max: number
  }
}

export interface CreateServiceData {
  title: string
  description: string
  price: number
  duration: number
  category: string
  images?: File[]
}

export interface ServiceReview {
  id: number
  user_name: string
  user_avatar?: string
  rating: number
  comment: string
  created_at: string
  replies?: ServiceReviewReply[]
}

export interface ServiceReviewReply {
  id: number
  comment: string
  created_at: string
  user_name: string
}
