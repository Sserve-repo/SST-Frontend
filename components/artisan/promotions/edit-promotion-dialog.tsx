"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromotionForm } from "./promotion-form";
import type { Promotion, PromotionFormData } from "@/types/promotions";

interface EditPromotionDialogProps {
  promotion: Promotion | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (promotionId: string, formData: FormData) => void;
}

export function EditPromotionDialog({
  promotion,
  onOpenChange,
  onSubmit,
}: EditPromotionDialogProps) {
  if (!promotion) return null;

  const handleSubmit = (data: PromotionFormData) => {
    const formData = new FormData();
    formData.append("discount_name", data.discount_name);
    formData.append("discount_type", data.discount_type);
    formData.append("discount_value", data.discount_value.toString());
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("usage_limit", data.usage_limit.toString());
    formData.append("description", data.description ?? "");
    formData.append("status", data.status);

    onSubmit(promotion.id, formData);
  };

  return (
    <Dialog open={!!promotion} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
        </DialogHeader>
        <PromotionForm promotion={promotion} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
