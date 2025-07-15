"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp } from "lucide-react";

interface TopProduct {
  month: number;
  product_name: string;
  total_sold: string;
}

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  // Group products by name and sum total sold
  const groupedProducts = products.reduce((acc, product) => {
    const name = product.product_name;
    if (acc[name]) {
      acc[name].total_sold += Number.parseInt(product.total_sold);
    } else {
      acc[name] = {
        product_name: name,
        total_sold: Number.parseInt(product.total_sold),
      };
    }
    return acc;
  }, {} as Record<string, { product_name: string; total_sold: number }>);

  const sortedProducts = Object.values(groupedProducts)
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Package className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No products data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProducts.map((product, index) => (
              <div
                key={product.product_name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.total_sold} sold
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {product.total_sold}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
