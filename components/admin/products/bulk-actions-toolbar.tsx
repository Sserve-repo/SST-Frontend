"use client";

import { Button } from "@/components/ui/button";
import { Check, Star, X, Loader2, Ban } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDisable?: () => void;
  onFeature?: () => void;
  isLoading?: boolean;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onApprove,
  onReject,
  onDisable,
  onFeature,
  isLoading = false,
}: BulkActionsToolbarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isLoading}
        >
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {onApprove && (
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={onApprove}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Approve
          </Button>
        )}
        {onReject && (
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onReject}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Reject
          </Button>
        )}
        {onFeature && (
          <Button
            size="sm"
            variant="outline"
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            onClick={onFeature}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Star className="mr-2 h-4 w-4" />
            )}
            Feature
          </Button>
        )}
        {onDisable && (
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDisable}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Ban className="mr-2 h-4 w-4" />
            )}
            Disable
          </Button>
        )}
      </div>
    </div>
  );
}
