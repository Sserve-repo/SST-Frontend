"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getDashboardOverview,
} from "@/actions/admin/dashboard-api";

export function TopProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDashboardOverview();
        console.log("Fetching top ordered products...", data);
        if (data?.Overview?.mostOrderedProducts) {
          setProducts(data.Overview.mostOrderedProducts);
        }
        console.log("Fetched products:", data?.Overview?.mostOrderedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Ordered Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Ordered Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.product_listing_detail_id}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{product.title}</p>
                  <span className="text-sm text-muted-foreground">
                    ${product.total_amount?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={product.order_percentage || 0}
                    className="h-2"
                  />
                  <span className="text-sm text-muted-foreground">
                    {product.order_percentage || 0}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.total_orders || 0} orders
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No product data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
