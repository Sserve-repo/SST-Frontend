import { Card } from "@/components/ui/card";
import { Package2, ClipboardList, PackageX } from "lucide-react";

interface MetricsCardsProps {
  totalProducts: string;
  activeProducts: number;
  outOfStock: number;
  totalStockValue: string;
  newProducts: string;
  outOfStockPercentage: string;
}

export function MetricsCards({
  totalProducts,
  activeProducts,
  outOfStock,
  totalStockValue,
  newProducts,
  outOfStockPercentage,
}: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Package2 className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <h3 className="text-2xl font-semibold">{totalProducts}</h3>
          </div>
        </div>
        <div className="text-sm text-orange-500">
          {totalStockValue} Total Product Stock Value
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <ClipboardList className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Products</p>
            <h3 className="text-2xl font-semibold">{activeProducts}</h3>
          </div>
        </div>
        <div className="text-sm text-purple-500">
          {newProducts} Since last month
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <PackageX className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <h3 className="text-2xl font-semibold">{outOfStock}</h3>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {outOfStockPercentage} of total inventory
        </div>
      </Card>
    </div>
  );
}
