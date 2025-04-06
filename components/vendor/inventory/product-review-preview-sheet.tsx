"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import ReviewsPage from "@/components/reviews/reviews-page";

interface ProductReviewsPreviewSheetProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductReviewsPreviewSheet({
  product,
  open,
  onOpenChange,
}: ProductReviewsPreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-scroll">
        <div className="mt-6 space-y-6">
          <ReviewsPage product={product} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
