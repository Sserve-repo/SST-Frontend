import { Button } from "@/components/ui/button"
import { Check, Star, Trash2, X } from "lucide-react"

interface BulkActionsToolbarProps {
  selectedCount: number
  onClearSelection: () => void
}

export function BulkActionsToolbar({ selectedCount, onClearSelection }: BulkActionsToolbarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="text-green-600">
          <Check className="mr-2 h-4 w-4" />
          Approve
        </Button>
        <Button size="sm" variant="outline" className="text-red-600">
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button size="sm" variant="outline" className="text-yellow-600">
          <Star className="mr-2 h-4 w-4" />
          Feature
        </Button>
        <Button size="sm" variant="outline" className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}

