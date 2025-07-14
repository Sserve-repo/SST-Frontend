"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditPromotionDialog } from "./edit-promotion-dialog";
import { DeletePromotionDialog } from "./delete-promotion-dialog";
import { PromotionMetrics } from "./promotion-metrics";
import { Pencil, Trash, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RawPromotion } from "@/types/promotions";

interface PromotionListProps {
  promotions: RawPromotion[];
  onUpdate: (id: number, formData: FormData) => void;
  onDelete: (id: number) => void;
}

export function PromotionList({
  promotions,
  onUpdate,
  onDelete,
}: PromotionListProps) {
  const [promotionToEdit, setPromotionToEdit] = useState<RawPromotion | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<RawPromotion | null>(null);

  return (
    <>
      <div className="grid gap-4">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{promotion.discount_name}</h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        promotion.status === "active" && "bg-green-100 text-green-700",
                        promotion.status === "upcoming" && "bg-blue-100 text-blue-700",
                        promotion.status === "expired" && "bg-gray-100 text-gray-700",
                        promotion.status === "disabled" && "bg-red-100 text-red-700"
                      )}
                    >
                      {promotion.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{promotion.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Discount:</span>
                      <span className="text-purple-600 font-semibold">
                        {promotion.discount_type === "percentage"
                          ? `${promotion.discount_value}%`
                          : `$${promotion.discount_value}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Period:</span>
                      <span className="text-gray-600">
                        {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Usage:</span>
                      <span className="text-gray-600">
                        {promotion.usage_count ?? 0} / {promotion.usage_limit || "∞"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <PromotionMetrics promotion={{
                    id: (promotion.id) ,
                    name: promotion.discount_name,
                    code: undefined,
                    type: promotion.discount_type,
                    value: parseFloat(promotion.discount_value),
                    startDate: new Date(promotion.start_date),
                    endDate: new Date(promotion.end_date),
                    status: promotion.status as "active" | "expired" | "upcoming" | "disabled",
                    usageLimit: promotion.usage_limit,
                    usageCount: promotion.usage_count ?? 0,
                    description: promotion.description,
                    createdAt: new Date(promotion.created_at),
                    updatedAt: new Date(promotion.updated_at),
                  }} />
                </div>

                <div className="flex items-center justify-end gap-2 md:col-span-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPromotionToEdit(promotion)}
                    className="hover:bg-purple-50 hover:border-purple-200"
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
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Eye className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
              <p className="text-gray-500">
                Create your first promotion to start attracting customers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <EditPromotionDialog
        promotion={promotionToEdit}
        onOpenChange={(open) => !open && setPromotionToEdit(null)}
        onSubmit={(id, formData) => {
          onUpdate(id, formData);
          setPromotionToEdit(null);
        }}
      />

      <DeletePromotionDialog
        promotion={promotionToDelete ? {
          id: promotionToDelete.id,
          name: promotionToDelete.discount_name,
          code: undefined,
          type: promotionToDelete.discount_type,
          value: parseFloat(promotionToDelete.discount_value),
          startDate: new Date(promotionToDelete.start_date),
          endDate: new Date(promotionToDelete.end_date),
          status: promotionToDelete.status as "active" | "expired" | "upcoming" | "disabled",
          usageLimit: promotionToDelete.usage_limit,
          usageCount: promotionToDelete.usage_count ?? 0,
          description: promotionToDelete.description,
          createdAt: new Date(promotionToDelete.created_at),
          updatedAt: new Date(promotionToDelete.updated_at),
        } : null}
        onOpenChange={(open) => !open && setPromotionToDelete(null)}
        onDelete={(id) => {
          onDelete(id);
          setPromotionToDelete(null);
        }}
      />
    </>
  );
}
