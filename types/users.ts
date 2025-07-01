export type User = {
  id: string;
  firstName: string;
  lastName: string;
  user_photo?: string; // Optional, can be null
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  role: "shopper" | "vendor" | "artisan" | "admin" | string;
  status: "active" | "inactive" | "banned" | string;
  joinedDate: Date | string; // ISO date string
  lastActive: Date | string; // ISO date string
};
