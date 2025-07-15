"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, Calendar, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface LatestOrder {
  id: number;
  order_no: string;
  user_id: number;
  total: string;
  vendor_tax: string;
  cart_total: string;
  shipping_cost: string;
  status: string;
  order_type: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
}

interface LatestOrdersProps {
  orders: LatestOrder[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function LatestOrders({ orders }: LatestOrdersProps) {
    console.log("Latest orders data:", orders);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Latest Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No orders available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {order.customer.firstname.charAt(0)}
                      {order.customer.lastname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.customer.firstname} {order.customer.lastname}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order #{order.order_no}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      ${Number.parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
