export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "shopper" | "vendor" | "artisan" | "admin" | string;
  status: "active" | "inactive" | "banned" | string;
  joinedDate: Date | string; // ISO date string
  lastActive: Date | string; // ISO date string
};
