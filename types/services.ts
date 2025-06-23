export type DayAvailability = {
  start: string;
  end: string;
};

export type ServiceAvailability = {
  [key: string]: DayAvailability;
};

export type Service = {
  id: string | undefined;
  name: string;
  description: string;
  price: number;
  duration: number;
  images: string[] | File[];
  availability: string;
  location?: string;
  homeService?: boolean,
  status?: string; // e.g., "pending", "approved", "rejected"
  category: string;
  createdAt: string | Date
  featured: boolean
  vendor?: {
    id: string;
    name: string;
    email: string;
  };
};


