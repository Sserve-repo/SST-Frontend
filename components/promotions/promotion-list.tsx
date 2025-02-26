"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditPromotionDialog } from "./edit-promotion-dialog";
import { DeletePromotionDialog } from "./delete-promotion-dialog";
import { PromotionMetrics } from "./promotion-metrics";
import { Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/types/promotions";

interface PromotionListProps {
  promotions: Promotion[];
  onUpdate: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
}

export function PromotionList({
  promotions,
  onUpdate,
  onDelete,
}: PromotionListProps) {
  const [promotionToEdit, setPromotionToEdit] = useState<Promotion | null>(
    null
  );
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(
    null
  );

  return (
    <>
      <div className="grid gap-4">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{promotion.code}</h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        promotion.status === "active" &&
                          "bg-green-100 text-green-700",
                        promotion.status === "upcoming" &&
                          "bg-blue-100 text-blue-700",
                        promotion.status === "expired" &&
                          "bg-gray-100 text-gray-700"
                      )}
                    >
                      {promotion.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {promotion.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Discount:</span>{" "}
                      {promotion.type === "percentage"
                        ? `${promotion.value}%`
                        : `$${promotion.value}`}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Service:</span>{" "}
                      {promotion.serviceName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Period:</span>{" "}
                      {promotion.startDate.toLocaleDateString()} -{" "}
                      {promotion.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <PromotionMetrics promotion={promotion} />
                </div>

                <div className="flex items-center justify-end gap-2 md:col-span-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPromotionToEdit(promotion)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setPromotionToDelete(promotion)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {promotions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No promotions found
          </div>
        )}
      </div>

      <EditPromotionDialog
        promotion={promotionToEdit}
        onOpenChange={(open) => !open && setPromotionToEdit(null)}
        onSubmit={(updatedPromotion) => {
          onUpdate(updatedPromotion);
          setPromotionToEdit(null);
        }}
      />

      <DeletePromotionDialog
        promotion={promotionToDelete}
        onOpenChange={(open) => !open && setPromotionToDelete(null)}
        onDelete={(id) => {
          onDelete(id);
          setPromotionToDelete(null);
        }}
      />
    </>
  );
}
