"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface AppointmentFiltersProps {
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
];

export function AppointmentFilters({
  selectedStatus,
  onStatusChange,
}: AppointmentFiltersProps) {
  console.log({ selectedStatus, onStatusChange });
  // const handleStatusToggle = (value: string) => {
  //   if (value === "all") {
  //     onStatusChange(["all"]);
  //     return;
  //   }

  //   let newStatus: string[];
  //   if (selectedStatus.includes(value)) {
  //     newStatus = selectedStatus.filter((s) => s !== value);
  //     if (newStatus.length === 0) newStatus = ["all"];
  //   } else {
  //     newStatus = selectedStatus.filter((s) => s !== "all");
  //     newStatus.push(value);
  //   }
  //   onStatusChange(newStatus);
  // };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by order ID or customer name..."
          className="pl-8 sm:max-w-[300px]"
        />
      </div>
      <div className="flex gap-4">
        <Select defaultValue="all-status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue="all-payment">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all-payment">All Payment Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="refund_pending">Refund Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export { STATUS_OPTIONS };
export type { AppointmentFiltersProps };
