"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

interface AppointmentFiltersProps {
  selectedStatus: string[]
  onStatusChange: (status: string[]) => void
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
]

export function AppointmentFilters({ selectedStatus, onStatusChange }: AppointmentFiltersProps) {
  const handleStatusToggle = (value: string) => {
    if (value === "all") {
      onStatusChange(["all"])
      return
    }

    let newStatus: string[]
    if (selectedStatus.includes(value)) {
      newStatus = selectedStatus.filter((s) => s !== value)
      if (newStatus.length === 0) newStatus = ["all"]
    } else {
      newStatus = selectedStatus.filter((s) => s !== "all")
      newStatus.push(value)
    }
    onStatusChange(newStatus)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedStatus.includes(option.value)}
            onCheckedChange={() => handleStatusToggle(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { STATUS_OPTIONS }
export type { AppointmentFiltersProps }