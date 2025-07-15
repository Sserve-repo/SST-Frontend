"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Calendar } from "lucide-react";
import { getOrders } from "@/actions/dashboard/artisans";

interface ServiceOrder {
  id: string;
  service_name: string;
  customer_name: string;
  customer_avatar?: string;
  amount: number;
  status: string;
  booking_date: string;
  rating?: number;
}

export function TopServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        if (response?.ok) {
          const data = await response.json();
          if (data.status && data.data) {
            // Transform and get top 10 orders
            const transformedOrders = data.data
              .slice(0, 10)
              .map((order: any) => ({
                id: order.id,
                service_name: order.service_name || "Service",
                customer_name: order.customer_name || "Customer",
                customer_avatar: order.customer_avatar,
                amount: Number.parseFloat(
                  order.total_amount || order.amount || 0
                ),
                status: order.status || "pending",
                booking_date: order.booking_date || order.created_at,
                rating: order.rating
                  ? Number.parseFloat(order.rating)
                  : undefined,
              }));
            setOrders(transformedOrders);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {/* <DollarSign className="h-5 w-5" /> */}
            Top Service Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
        <CardTitle className="flex items-center gap-2">
          {/* <DollarSign className="h-5 w-5 text-green-600" /> */}
          Top Service Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No service orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                    {index + 1}
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={order.customer_avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {order.customer_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {order.service_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {order.customer_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(order.booking_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-semibold text-green-600">
                    ${order.amount.toFixed(2)}
                  </p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace("_", " ")}
                  </Badge>
                  {order.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">
                        {order.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
