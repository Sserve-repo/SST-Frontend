import { Suspense } from "react";
import { DashboardStats } from "./stats";
import { RecentActivities } from "./recent-activities";
import { QuickActions } from "./quick-actions";
import { DashboardHeader } from "./header";
import { DashboardSkeleton } from "./skeleton";
import { SalesAnalytics } from "./orders/sales-analytics";

export default function VendorPage() {
  return (
    <div className="space-y-6 p-4">
      <DashboardHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-6">
          <DashboardStats />
          <QuickActions />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-9">
            <div className="md:col-span-1 lg:col-span-6">
              <SalesAnalytics />
            </div>
            <div className="md:col-span-1 lg:col-span-3">
              <RecentActivities />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
