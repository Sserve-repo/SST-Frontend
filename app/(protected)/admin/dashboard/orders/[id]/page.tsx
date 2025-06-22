"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  getOrderById,
  type OrderDetailResponse,
} from "@/actions/admin/order-api";
import { ArrowLeft, Package, User, DollarSign, Truck } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getOrderById(params.id as string);

      if (apiError) {
        throw new Error(apiError);
      }

      if (data) {
        setOrder(data);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "in_progress":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchOrder} />;
  }

  if (!order) {
    return <ErrorMessage message="Order not found" onRetry={fetchOrder} />;
  }

  const orderDetails = order["Order Details"];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-8 justify-between w-full">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-xl text-primary font-bold">Order Details</h1>
          <p className="text-muted-foreground">
            Order #{orderDetails.order_no}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex text-xl text-primary items-center gap-2">
              <Package className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order No:</span>
              <span className="font-medium">{orderDetails.order_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={getStatusVariant(orderDetails.status)}>
                {orderDetails.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Type:</span>
              <Badge variant="outline">{orderDetails.order_type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>
                {new Date(orderDetails.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated:</span>
              <span>
                {new Date(orderDetails.updated_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex text-xl text-primary items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {orderDetails.customer.firstname}{" "}
                {orderDetails.customer.lastname}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{orderDetails.customer.email}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID:</span>
              <span>{orderDetails.customer.id}</span>
            </div> */}
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex text-xl text-primary items-center gap-2">
              <Truck className="h-5 w-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-medium">
                {orderDetails.delivery_information.firstname}{" "}
                {orderDetails.delivery_information.lastname}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span>{orderDetails.delivery_information.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City:</span>
              <span>{orderDetails.delivery_information.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Postal Code:</span>
              <span>{orderDetails.delivery_information.postal_code}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Province ID:</span>
              <span>{orderDetails.delivery_information.province_id}</span>
            </div> */}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex text-xl text-primary items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cart Total:</span>
              <span>${orderDetails.cart_total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendor Tax:</span>
              <span>${orderDetails.vendor_tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Cost:</span>
              <span>${orderDetails.shipping_cost}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>${orderDetails.total}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderDetails.product_items?.length ? (
              orderDetails.product_items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      {item.product_image && (
                        <img
                          src={item.product_image || "/assets/images/image-placeholder.png"}
                          alt={item.product_name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-lg">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Category: {item.product_category}
                        </p>
                        {item.product_description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product_description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Product ID: #{item.product_listing_detail_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Item ID: #{item.id}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vendor:</span>
                        <div className="text-right">
                          <p className="font-medium">{item.vendor_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.vendor_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Unit Price:
                        </span>
                        <span className="font-medium">${item.unit_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Amount:
                        </span>
                        <span className="font-medium text-lg">
                          ${item.total_amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Item Status:
                        </span>
                        <Badge variant={getStatusVariant(item.order_status)}>
                          {item.order_status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Payment Status:
                        </span>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-muted-foreground text-lg">
                  No products found in this order.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
