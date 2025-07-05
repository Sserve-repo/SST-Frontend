export type ServiceStatus = "active" | "inactive" | "draft";

export interface Service {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  status: ServiceStatus;
  images: string[];
  availability: ServiceAvailability[];
  rating: number;
  featured?: boolean;
  location?: string;
  reviewCount: number;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ServiceFilters {
  category?: string;
  status?: ServiceStatus;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  images?: File[];
}

export interface ServiceReview {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  replies?: ServiceReviewReply[];
}

export interface ServiceReviewReply {
  id: number;
  comment: string;
  created_at: string;
  user_name: string;
}
