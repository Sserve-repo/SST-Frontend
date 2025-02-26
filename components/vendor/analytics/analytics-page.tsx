import { Suspense } from "react";
import { AnalyticsHeader } from "./header";
import { AnalyticsOverview } from "./overview";
import { AnalyticsSkeleton } from "./skeleton";
import { SalesChart } from "./sales-chart";
import { CustomerMetrics } from "./customer-metrics";
import { ProductPerformance } from "./product-performance";
import { TrafficSources } from "./traffic-sources";
import { RevenueReport } from "./revenue-report";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-4">
      <AnalyticsHeader />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <div className="space-y-6">
          <AnalyticsOverview />
          <div className="grid gap-6 md:grid-cols-2">
            <SalesChart />
            <CustomerMetrics />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ProductPerformance />
            <TrafficSources />
          </div>
          <RevenueReport />
        </div>
      </Suspense>
    </div>
  );
}
