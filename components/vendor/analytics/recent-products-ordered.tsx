"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, DollarSign, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentProductOrdered {
  id: number;
  order_id: number;
  user_id: number;
  local_id: string;
  vendor_id: number;
  product_listing_detail_id: number;
  quantity: number;
  unit_price: number;
  total_amount: string;
  currency: string;
  status: string;
  order_status: string;
  payout_status: string;
  payout_id: number | null;
  created_at: string;
  updated_at: string;
}

interface RecentProductsOrderedProps {
  products: RecentProductOrdered[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentProductsOrdered({
  products,
}: RecentProductsOrderedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Recent Products Ordered
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Package className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No recent orders available</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Product #{product.product_listing_detail_id}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Customer #{product.user_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(product.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">
                      Qty: {product.quantity}
                    </span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        ${Number.parseFloat(product.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.order_status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
