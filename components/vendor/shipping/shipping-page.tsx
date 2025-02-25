import { Suspense } from "react";
import { ShippingHeader } from "./header";
import { ShippingOverview } from "./overview";
import { ShippingTable } from "./table";
import { ShippingTableSkeleton } from "./table-skeleton";
import { TrackingPanel } from "./tracking-panel";

export default function ShippingPage() {
  return (
    <div className="space-y-6 p-4">
      <ShippingHeader />
      <ShippingOverview />
      <div className="grid gap-6 md:grid-cols-9">
        <div className="md:col-span-6">
          <Suspense fallback={<ShippingTableSkeleton />}>
            <ShippingTable />
          </Suspense>
        </div>
        <div className="md:col-span-3">
          <TrackingPanel />
        </div>
      </div>
    </div>
  );
}
