"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Promotion } from "@/types/promotions";
import { CreatePromotionDialog } from "./create-promotion-dialog";
import { PromotionList } from "./promotion-list";
import {
  createPromotions,
  deletePromotions,
  getPromotions,
} from "@/actions/dashboard/vendors";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const handleFetchPromotions = async () => {
    try {
      const response = await getPromotions();
      if (!response?.ok) {
        throw Error("Error fetching promotions");
      }

      const data = await response.json();
      // console.log({ data });

      const transformedPromotions = data?.data?.productDiscount.map((pd) => {
        return {
          id: pd.id,
          code: pd?.discount_name?.toUpperCase(),
          type: pd?.discount_type?.toLowerCase(),
          value: pd.discount_value,
          serviceName: pd.discount_name,
          startDate: pd.start_date,
          endDate: pd.end_date,
          status: pd?.status?.toLowerCase(),
          usageLimit: pd?.usage_limit,
          usageCount: pd?.usage_limit,
          description: pd.description,
        };
      });

      setPromotions(transformedPromotions || []);
    } catch (error) {
      console.error("internal server error occured.", error);
    }
  };

  useEffect(() => {
    handleFetchPromotions();
  }, []);

  const handleCreatePromotion = async (
    newPromotion: Omit<Promotion, "id" | "status" | "usageCount">
  ) => {
    try {
      const now = new Date();
      let status: Promotion["status"] = "upcoming";

      if (
        (newPromotion?.startDate as Date) <= now &&
        (newPromotion?.endDate as Date) >= now
      ) {
        status = "active";
      } else if ((newPromotion?.endDate as Date) < now) {
        status = "expired";
      }

      const promotion: Promotion = {
        ...newPromotion,
        id: Math.random().toString(36).substr(2, 9),
        status,
        usageCount: 0,
      };

      const formData = new FormData();

      formData.append("discount_name", promotion.serviceName);
      formData.append("discount_type", promotion.type);
      formData.append("discount_value", String(promotion.value));
      formData.append(
        "start_date",
        new Date(promotion.startDate).toISOString().split("T")[0]
      );
      formData.append(
        "end_date",
        new Date(promotion.endDate).toISOString().split("T")[0]
      );
      formData.append("status", promotion.status);
      formData.append("usage_limit", String(promotion.usageLimit)); // Convert number to string
      formData.append("description", promotion.description);

      const response = await createPromotions(formData);
      if (!response?.ok) {
        throw Error("Error creating promtotion");
      }
      const data = await response.json();
      console.log({ data });

      setPromotions([...promotions, promotion]);
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  const handleUpdatePromotion = (updatedPromotion: Promotion) => {
    setPromotions(
      promotions.map((p) =>
        p.id === updatedPromotion.id ? updatedPromotion : p
      )
    );
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const response = await deletePromotions(id);
      if (!response?.ok) {
        throw Error("Error deleting promtotion");
      }
      setPromotions(promotions.filter((p) => p.id !== id));
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  const activePromotions = promotions.filter((p) => p.status === "active");
  const upcomingPromotions = promotions.filter((p) => p.status === "upcoming");
  const expiredPromotions = promotions.filter((p) => p.status === "expired");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Promotions & Discounts
          </h1>
          <p className="text-gray-500">
            Manage your promotional offers and discounts
          </p>
        </div>
        <CreatePromotionDialog onSubmit={handleCreatePromotion}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </CreatePromotionDialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4 space-x-2">
        <TabsList>
          <TabsTrigger value="all">All ({promotions.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({activePromotions.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingPromotions.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredPromotions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PromotionList
            promotions={promotions}
            onUpdate={handleUpdatePromotion}
            onDelete={handleDeletePromotion}
          />
        </TabsContent>

        <TabsContent value="active">
          <PromotionList
            promotions={activePromotions}
            onUpdate={handleUpdatePromotion}
            onDelete={handleDeletePromotion}
          />
        </TabsContent>

        <TabsContent value="upcoming">
          <PromotionList
            promotions={upcomingPromotions}
            onUpdate={handleUpdatePromotion}
            onDelete={handleDeletePromotion}
          />
        </TabsContent>

        <TabsContent value="expired">
          <PromotionList
            promotions={expiredPromotions}
            onUpdate={handleUpdatePromotion}
            onDelete={handleDeletePromotion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
