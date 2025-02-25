"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PromotionForm } from "./promotion-form";
import type { Promotion } from "@/types/promotions";

interface CreatePromotionDialogProps {
  children: React.ReactNode;
  onSubmit: (
    promotion: Omit<Promotion, "id" | "status" | "usageCount">
  ) => void;
}

export function CreatePromotionDialog({
  children,
  onSubmit,
}: CreatePromotionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (
    data: Omit<Promotion, "id" | "status" | "usageCount">
  ) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Create New Promotion</DialogTitle>
        </DialogHeader>
        <PromotionForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
