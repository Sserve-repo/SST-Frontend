import { Progress } from "@/components/ui/progress";
import type { Promotion } from "@/types/promotions";

interface PromotionMetricsProps {
  promotion: Promotion;
}

export function PromotionMetrics({ promotion }: PromotionMetricsProps) {
  const usagePercentage = (promotion.usageCount / promotion.usageLimit) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Usage</p>
          <p className="text-2xl font-bold">
            {promotion.usageCount} / {promotion.usageLimit}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm font-medium">Remaining</p>
          <p className="text-2xl font-bold">
            {promotion.usageLimit - promotion.usageCount}
          </p>
        </div>
      </div>
      <Progress value={usagePercentage} className="h-2" />
      <p className="text-sm text-gray-500">
        {usagePercentage.toFixed(1)}% of total limit used
      </p>
    </div>
  );
}
