"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Percent } from "lucide-react";
import type { Promotion } from "@/types/promotions";

interface PromotionMetricsProps {
  promotion: Promotion;
}

export function PromotionMetrics({ promotion }: PromotionMetricsProps) {
  const usagePercentage =
    promotion.usageLimit > 0
      ? (promotion.usageCount / promotion.usageLimit) * 100
      : 0;
  const remaining =
    promotion.usageLimit > 0
      ? Math.max(0, promotion.usageLimit - promotion.usageCount)
      : "Unlimited";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Usage</p>
              <p className="text-2xl font-bold">{promotion.usageCount}</p>
              <p className="text-xs text-gray-500">
                of {promotion.usageLimit > 0 ? promotion.usageLimit : "∞"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Remaining</p>
              <p className="text-2xl font-bold">{remaining}</p>
              <p className="text-xs text-gray-500">uses left</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Total Savings</p>
              <p className="text-2xl font-bold">
                ${promotion.totalSavings?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500">customer savings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Conversion</p>
              <p className="text-2xl font-bold">
                {promotion.conversionRate?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-xs text-gray-500">usage rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {promotion.usageLimit > 0 && (
        <div className="md:col-span-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Usage Progress</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
}
