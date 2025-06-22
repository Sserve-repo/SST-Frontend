"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Promotion } from "@/types/promotions";
import { CreatePromotionDialog } from "./create-promotion-dialog";
import { PromotionList } from "./promotion-list";
import {
  createPromotions,
  deletePromotions,
  getPromotions,
} from "@/actions/dashboard/artisans";
import { AppointmentSkeletonList } from "../appointments/appointment-skeleton-list";

// Helper function to determine discount status
const getDiscountStatus = (
  startDate: string,
  endDate: string,
  usageLimit: number,
  usageCount: number
): Promotion["status"] => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if usage limit is reached
  if (usageLimit > 0 && usageCount >= usageLimit) {
    return "expired";
  }

  // Check date ranges
  if (start > now) {
    return "upcoming";
  } else if (end < now) {
    return "expired";
  } else {
    return "active";
  }
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await getPromotions();

      if (!response?.ok) {
        throw new Error("Failed to fetch promotions");
      }

      const data = await response.json();

      const transformedPromotions: Promotion[] =
        data?.data?.ServiceDiscount?.map((pd: any) => {
          const status = getDiscountStatus(
            pd.start_date,
            pd.end_date,
            Number.parseInt(pd.usage_limit || "0"),
            Number.parseInt(pd.usage_count || "0")
          );

          return {
            id: pd.id.toString(),
            code: pd.discount_name?.toUpperCase() || "",
            type:
              pd.discount_type?.toLowerCase() === "percentage"
                ? "percentage"
                : "fixed",
            value: Number.parseFloat(pd.discount_value || "0"),
            startDate: new Date(pd.start_date),
            endDate: new Date(pd.end_date),
            status,
            usageLimit: Number.parseInt(pd.usage_limit || "0"),
            usageCount: Number.parseInt(pd.usage_count || "0"),
            description: pd.description || "",
            // Calculate metrics
            totalSavings: Number.parseFloat(pd.total_savings || "0"),
            redemptions: Number.parseInt(pd.usage_count || "0"),
            conversionRate:
              pd.usage_limit > 0
                ? (Number.parseInt(pd.usage_count || "0") /
                    Number.parseInt(pd.usage_limit)) *
                  100
                : 0,
          };
        }) || [];

      setPromotions(transformedPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast({
        title: "Error",
        description: "Failed to load promotions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreatePromotion = async (
    newPromotion: Omit<
      Promotion,
      | "id"
      | "status"
      | "usageCount"
      | "totalSavings"
      | "redemptions"
      | "conversionRate"
    >
  ) => {
    try {
      // Determine status using the getDiscountStatus function
      const status = getDiscountStatus(
        newPromotion.startDate.toISOString().split("T")[0],
        newPromotion.endDate.toISOString().split("T")[0],
        newPromotion.usageLimit,
        0 // New promotion starts with 0 usage
      );

      const formData = new FormData();
      formData.append("discount_name", newPromotion.code);
      formData.append("discount_type", newPromotion.type);
      formData.append("discount_value", String(newPromotion.value));
      formData.append(
        "start_date",
        newPromotion.startDate.toISOString().split("T")[0]
      );
      formData.append(
        "end_date",
        newPromotion.endDate.toISOString().split("T")[0]
      );
      formData.append("usage_limit", String(newPromotion.usageLimit));
      formData.append("description", newPromotion.description);

      const response = await createPromotions(formData);

      if (!response?.ok) {
        throw new Error("Failed to create promotion");
      }

      toast({
        title: "Success",
        description: "Promotion created successfully",
      });

      // Refresh the promotions list
      fetchPromotions();
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast({
        title: "Error",
        description: "Failed to create promotion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePromotion = async (updatedPromotion: Promotion) => {
    try {
      // Update status based on current data
      const status = getDiscountStatus(
        updatedPromotion.startDate.toISOString().split("T")[0],
        updatedPromotion.endDate.toISOString().split("T")[0],
        updatedPromotion.usageLimit,
        updatedPromotion.usageCount
      );

      const promotionWithUpdatedStatus = {
        ...updatedPromotion,
        status,
      };

      setPromotions(
        promotions.map((p) =>
          p.id === updatedPromotion.id ? promotionWithUpdatedStatus : p
        )
      );

      toast({
        title: "Success",
        description: "Promotion updated successfully",
      });
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast({
        title: "Error",
        description: "Failed to update promotion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const response = await deletePromotions(id);

      if (!response?.ok) {
        throw new Error("Failed to delete promotion");
      }

      setPromotions(promotions.filter((p) => p.id !== id));

      toast({
        title: "Success",
        description: "Promotion deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "Failed to delete promotion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const activePromotions = promotions.filter((p) => p.status === "active");
  const upcomingPromotions = promotions.filter((p) => p.status === "upcoming");
  const expiredPromotions = promotions.filter((p) => p.status === "expired");

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-primary">
          Promotions & Discounts
        </h1>
        <AppointmentSkeletonList count={6} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Promotions & Discounts
          </h1>
          <p className="text-gray-500">
            Manage your promotional offers and track their performance
          </p>
        </div>
        <CreatePromotionDialog onSubmit={handleCreatePromotion}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </CreatePromotionDialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
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
