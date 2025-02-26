import { MetricsCard } from "./metrics-card";
import type { UserType } from "@/types/order";
import type { OrderMetrics, MetricDisplay } from "@/types/order";

interface RoleMetricsProps {
  metrics: OrderMetrics;
  userType: UserType;
  isLoading?: boolean;
}

export function RoleMetrics({
  metrics,
  isLoading,
}: RoleMetricsProps) {
  if (!metrics) return null;

  // Convert metrics object to array for rendering
  const metricsArray = Object.entries(metrics).map(([key, metric]) => ({
    key,
    metric: metric as MetricDisplay,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsArray.map(({ key, metric }) => (
        <MetricsCard
          key={key}
          value={metric.value}
          trend={metric.trend}
          trendText={metric.trendText}
          icon={metric.icon}
          label={metric.label}
          color={metric.color}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
