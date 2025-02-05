import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MetricDisplay } from "@/types/order";

interface MetricsCardProps extends Omit<MetricDisplay, "icon"> {
  icon: MetricDisplay["icon"];
  isLoading?: boolean;
}

export function MetricsCard({
  value,
  trend,
  trendText,
  icon: Icon,
  label,
  color,
  isLoading,
}: MetricsCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <Skeleton className="mt-4 h-4 w-32" />
      </Card>
    );
  }

  const isPositive = trend > 0;
  const trendClass = isPositive ? "text-emerald-600" : "text-red-600";
  const trendIcon = isPositive ? "↑" : "↓";

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="flex items-center gap-4">
        <div className={cn("rounded-xl p-4", color.bg)}>
          <Icon className={cn("h-6 w-6", color.text)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-semibold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span
          className={cn(
            "text-sm font-medium flex items-center gap-1",
            trendClass
          )}
        >
          {trendIcon} {Math.abs(trend)}%
        </span>
        <span className="text-sm text-muted-foreground">{trendText}</span>
      </div>
    </Card>
  );
}
