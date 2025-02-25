import { Button } from "@/components/ui/button";
import type { MessageFilter } from "@/types/messages";

interface MessageFiltersProps {
  value: MessageFilter;
  onChange: (value: MessageFilter) => void;
}

export function MessageFilters({ value, onChange }: MessageFiltersProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === "all" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("all")}
      >
        All
      </Button>
      <Button
        variant={value === "unread" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("unread")}
      >
        Unread
      </Button>
      <Button
        variant={value === "archived" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("archived")}
      >
        Archived
      </Button>
    </div>
  );
}
