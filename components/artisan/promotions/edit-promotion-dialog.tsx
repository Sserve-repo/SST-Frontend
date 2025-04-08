"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromotionForm } from "./promotion-form";
import type { Promotion } from "@/types/promotions";

interface EditPromotionDialogProps {
  promotion: Promotion | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (promotion: Promotion) => void;
}

export function EditPromotionDialog({
  promotion,
  onOpenChange,
  onSubmit,
}: EditPromotionDialogProps) {
  if (!promotion) return null;

  return (
    <Dialog open={!!promotion} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
        </DialogHeader>
        <PromotionForm promotion={promotion} onSubmit={onSubmit as any} />
      </DialogContent>
    </Dialog>
  );
}
