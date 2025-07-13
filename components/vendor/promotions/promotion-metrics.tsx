"use client";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import type { Promotion } from "@/types/promotions";

interface PromotionMetricsProps {
  promotion: Promotion;
}

export function PromotionMetrics({ promotion }: PromotionMetricsProps) {
  const usagePercentage = promotion.usageLimit
    ? (promotion.usageCount / promotion.usageLimit) * 100
    : 0;

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(promotion.endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalDays = Math.ceil(
    (new Date(promotion.endDate).getTime() -
      new Date(promotion.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const timeProgress =
    totalDays > 0
      ? Math.min(100, ((totalDays - daysLeft) / totalDays) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-purple-600" />
          Usage Progress
        </div>
        <Progress value={usagePercentage} className="h-2" />
        <p className="text-xs text-gray-500">
          {promotion.usageCount} of {promotion.usageLimit || "unlimited"} uses
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-purple-600" />
          Time Progress
        </div>
        <Progress value={timeProgress} className="h-2" />
        <p className="text-xs text-gray-500">
          {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="h-4 w-4 text-green-600" />
          Revenue Impact
        </div>
        <p className="text-lg font-semibold text-green-600">
          ${(promotion.usageCount * 50).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">Estimated savings given</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          Performance
        </div>
        <p className="text-lg font-semibold text-blue-600">
          {promotion.usageLimit ? Math.round(usagePercentage) : 0}%
        </p>
        <p className="text-xs text-gray-500">Usage rate</p>
      </div>
    </div>
  );
}
