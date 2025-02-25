"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReviewSortProps {
  value: string
  onValueChange: (value: "latest" | "rating") => void
}

export function ReviewSort({ value, onValueChange }: ReviewSortProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">Latest First</SelectItem>
        <SelectItem value="rating">Highest Rating</SelectItem>
      </SelectContent>
    </Select>
  )
}

