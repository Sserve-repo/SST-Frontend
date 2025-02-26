"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Promotion } from "@/types/promotions";
import { CreatePromotionDialog } from "./create-promotion-dialog";
import { PromotionList } from "./promotion-list";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "1",
      code: "SUMMER2025",
      type: "percentage",
      value: 20,
      serviceId: "1",
      serviceName: "Haircut & Styling",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-08-31"),
      status: "upcoming",
      usageLimit: 100,
      usageCount: 0,
      description: "Summer special discount",
    },
    {
      id: "2",
      code: "WELCOME50",
      type: "fixed",
      value: 50,
      serviceId: "2",
      serviceName: "Hair Coloring",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-12-31"),
      status: "active",
      usageLimit: 200,
      usageCount: 45,
      description: "New customer discount",
    },
    {
      id: "3",
      code: "WINTER2023",
      type: "percentage",
      value: 15,
      serviceId: "all",
      serviceName: "All Services",
      startDate: new Date("2023-12-01"),
      endDate: new Date("2025-01-31"),
      status: "expired",
      usageLimit: 150,
      usageCount: 132,
      description: "Winter season discount",
    },
  ]);

  const handleCreatePromotion = (
    newPromotion: Omit<Promotion, "id" | "status" | "usageCount">
  ) => {
    const now = new Date();
    let status: Promotion["status"] = "upcoming";

    if (newPromotion.startDate <= now && newPromotion.endDate >= now) {
      status = "active";
    } else if (newPromotion.endDate < now) {
      status = "expired";
    }

    const promotion: Promotion = {
      ...newPromotion,
      id: Math.random().toString(36).substr(2, 9),
      status,
      usageCount: 0,
    };

    setPromotions([...promotions, promotion]);
  };

  const handleUpdatePromotion = (updatedPromotion: Promotion) => {
    setPromotions(
      promotions.map((p) =>
        p.id === updatedPromotion.id ? updatedPromotion : p
      )
    );
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter((p) => p.id !== id));
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

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
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
