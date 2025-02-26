import { Suspense } from "react";
import { InventoryHeader } from "./header";
import { InventoryOverview } from "./overview";
import { InventoryTable } from "./table";
import { InventoryTableSkeleton } from "./table-skeleton";

export default function InventoryPage() {
  return (
    <div className="space-y-6 p-4">
      <InventoryHeader />
      <InventoryOverview />
      <Suspense fallback={<InventoryTableSkeleton />}>
        <InventoryTable />
      </Suspense>
    </div>
  );
}
