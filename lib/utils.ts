import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTime(timestamp: string): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

export function capitalizeFirstLetter(str) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function getStatusFromNumber(
  status: number
): "pending" | "approved" | "rejected" {
  switch (status) {
    case 1:
      return "approved";
    case 2:
      return "rejected";
    default:
      return "pending";
  }
}
