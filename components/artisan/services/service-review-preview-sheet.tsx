"use client";

import ServiceReviewsPage from "@/components/reviews/service-review-page";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ServiceReviewsPreviewSheetProps {
  service: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceReviewsPreviewSheet({
  service,
  open,
  onOpenChange,
}: ServiceReviewsPreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-scroll">
        <div className="mt-6 space-y-6">
          <ServiceReviewsPage service={service} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
