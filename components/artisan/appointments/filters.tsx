"use client";

// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CalendarIcon, X } from "lucide-react";
// import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentFiltersProps {
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;
  onDateFilter?: (date: string | null) => void;
  selectedDate?: string | null;
}

const statusOptions = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-700" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "inprogress",
    label: "In Progress",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
  { value: "canceled", label: "Canceled", color: "bg-red-100 text-red-700" },
  {
    value: "rescheduled",
    label: "Rescheduled",
    color: "bg-purple-100 text-purple-700",
  },
];

export function AppointmentFilters({
  selectedStatus,
  onStatusChange,
  onDateFilter,
  selectedDate,
}: AppointmentFiltersProps) {
  const handleStatusToggle = (status: string) => {
    if (status === "all") {
      onStatusChange(["all"]);
      return;
    }

    let newStatus: string[];
    if (selectedStatus.includes("all")) {
      newStatus = [status];
    } else if (selectedStatus.includes(status)) {
      newStatus = selectedStatus.filter((s) => s !== status);
      if (newStatus.length === 0) {
        newStatus = ["all"];
      }
    } else {
      newStatus = [...selectedStatus, status];
    }

    onStatusChange(newStatus);
  };

  // const handleDateSelect = (date: Date | undefined) => {
  //   if (onDateFilter) {
  //     onDateFilter(date ? format(date, "yyyy-MM-dd") : null);
  //   }
  // };

  // const clearDateFilter = () => {
  //   if (onDateFilter) {
  //     onDateFilter(null);
  //   }
  // };

  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 flex items-center">
          Filter by Status:
        </span>
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            variant="secondary"
            className={cn(
              "cursor-pointer transition-colors hover:opacity-80",
              selectedStatus.includes(option.value)
                ? option.color
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            )}
            onClick={() => handleStatusToggle(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {onDateFilter && (
        <></>
        // <div className="flex items-center gap-2">
        //   <span className="text-sm font-medium text-gray-700">Date:</span>
        //   <Popover>
        //     <PopoverTrigger asChild>
        //       <Button
        //         variant="outline"
        //         className={cn(
        //           "justify-start text-left font-normal",
        //           !selectedDate && "text-muted-foreground"
        //         )}
        //       >
        //         <CalendarIcon className="mr-2 h-4 w-4" />
        //         {selectedDate
        //           ? format(new Date(selectedDate), "PPP")
        //           : "Pick a date"}
        //       </Button>
        //     </PopoverTrigger>
        //     <PopoverContent className="w-auto p-0" align="start">
        //       <Calendar
        //         mode="single"
        //         selected={selectedDate ? new Date(selectedDate) : undefined}
        //         onSelect={handleDateSelect}
        //         initialFocus
        //       />
        //     </PopoverContent>
        //   </Popover>
        //   {selectedDate && (
        //     <Button
        //       variant="ghost"
        //       size="sm"
        //       onClick={clearDateFilter}
        //       className="h-8 w-8 p-0"
        //     >
        //       <X className="h-4 w-4" />
        //     </Button>
        //   )}
        // </div>
      )}
    </div>
  );
}
