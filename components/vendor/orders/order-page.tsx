import { Suspense } from "react";
import { OrdersHeader } from "./header";
import { OrdersOverview } from "./overview";
import { OrdersTable } from "./table";
import { OrdersTableSkeleton } from "./table-skeleton";
import { SalesAnalytics } from "./sales-analytics";

export default function OrdersPage() {
  return (
    <div className="space-y-6 p-4">
      <OrdersHeader />
      <OrdersOverview />
      <div className="grid gap-6 md:grid-cols-9">
        <div className="md:col-span-6">
          <Suspense fallback={<OrdersTableSkeleton />}>
            <OrdersTable />
          </Suspense>
        </div>
        <div className="md:col-span-3">
          <SalesAnalytics />
        </div>
      </div>
    </div>
  );
}
