"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MessageFilter } from "@/types/messages";

interface MessageFiltersProps {
  value: MessageFilter;
  onChange: (filter: MessageFilter) => void;
}

const filters: { value: MessageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "archived", label: "Archived" },
];

export function MessageFilters({ value, onChange }: MessageFiltersProps) {
  return (
    <div className="flex gap-1">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={value === filter.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(filter.value)}
          className={cn(
            "h-8 text-xs",
            value === filter.value && "bg-primary text-primary-foreground"
          )}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
