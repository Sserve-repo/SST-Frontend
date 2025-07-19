export type ServiceStatus = "active" | "inactive" | "draft";

export interface Service {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  duration: number;
  service_duration?: number;
  category: string;
  category_id?: number;
  sub_category_id?: number;
  service_category_id?: number;
  service_category_items_id?: number;
  status: ServiceStatus | number | string;
  images: string[];
  image?: string;
  service_images?: Array<{
    id: number;
    user_id: number;
    service_listing_detail_id: number;
    image: string;
    created_at: string;
    updated_at: string;
  }>;
  service_category?: {
    id: number;
    name: string;
  };
  service_category_item?: {
    id: number;
    name: string;
  };
  availability: ServiceAvailability[];
  available_dates?: string[];
  start_time?: string;
  end_time?: string;
  home_service_availability?: string | number;
  rating: number;
  featured?: boolean;
  is_featured?: number;
  location?: string;
  reviewCount: number;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
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
