"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Trash2, Star, Loader2 } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onFeature: () => void;
  isLoading?: boolean;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onApprove,
  onReject,
  onDelete,
  onFeature,
  isLoading = false,
}: BulkActionsToolbarProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedCount} items selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            disabled={isLoading}
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
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

          <Button
            variant="outline"
            size="sm"
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

          <Button
            variant="outline"
            size="sm"
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

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
