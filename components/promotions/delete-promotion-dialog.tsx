"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Promotion } from "@/types/promotions";

interface DeletePromotionDialogProps {
  promotion: Promotion | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export function DeletePromotionDialog({
  promotion,
  onOpenChange,
  onDelete,
}: DeletePromotionDialogProps) {
  if (!promotion) return null;

  return (
    <AlertDialog open={!!promotion} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the promotion &quot;{promotion.name}
            &quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(promotion.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
