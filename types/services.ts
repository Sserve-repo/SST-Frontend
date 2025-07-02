export type ServiceStatus = "active" | "inactive" | "draft";

export interface Service {
  vendor: any;
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  featured?: boolean;
  duration: number;
  category: string;
  status: ServiceStatus;
  images: string[];
  homeService?: boolean;
  availability: ServiceAvailability[];
  location?: string;
  rating: number;
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
