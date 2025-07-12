"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateOrderItemStatus } from "@/actions/dashboard/vendors";
import { Loader2, Package, MapPin, CreditCard } from "lucide-react";

interface OrderPreviewSheetProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function OrderPreviewSheet({
  order,
  open,
  onOpenChange,
  onUpdate,
}: OrderPreviewSheetProps) {
  const [statuses, setStatuses] = useState<{ [key: string]: string }>(() => {
    const initialStatuses: { [key: string]: string } = {};
    if (order?.items) {
      order.items.forEach((item: any) => {
        initialStatuses[item.id] = item.order_status || "pending";
      });
    }
    return initialStatuses;
  });
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const updateStatus = async (itemId: string, newStatus: string) => {
    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));

      const response = await updateOrderItemStatus(itemId, newStatus);

      if (response?.ok) {
        const result = await response.json();
        if (result.status) {
          setStatuses((prev) => ({
            ...prev,
            [itemId]: newStatus,
          }));

          toast({
            title: "Success",
            description: "Order status updated successfully",
          });

          if (onUpdate) {
            onUpdate();
          }
        } else {
          throw new Error(result.message || "Failed to update status");
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "intransit":
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-3">
          <SheetTitle className="text-xl font-semibold text-gray-900">
            Order {order?.orderNumber}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Placed on{" "}
            {order?.date ? new Date(order.date).toLocaleDateString() : "N/A"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Separator />

          {/* Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">
                Customer Information
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="font-medium text-gray-900">
                  {order?.customer?.name || "Unknown Customer"}
                </div>
                <div className="text-sm text-gray-600">
                  {order?.customer?.email || "No email"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Order Items</h3>
            <div className="space-y-4">
              {order?.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 space-y-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item?.product_name || item?.name || "Unknown Product"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Qty: {item?.quantity || 1} × $
                        {Number(item?.unit_price || item?.price || 0).toFixed(
                          2
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        Total: $
                        {Number(
                          (item?.unit_price || item?.price || 0) *
                            (item?.quantity || 1)
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Current Status
                      </span>
                      <Badge
                        variant="outline"
                        className={`capitalize ${getStatusBadgeColor(
                          statuses[item.id] || item.order_status || "pending"
                        )} border`}
                      >
                        {statuses[item.id] || item.order_status || "pending"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Update Status
                      </label>
                      <Select
                        value={
                          statuses[item.id] || item.order_status || "pending"
                        }
                        onValueChange={(value) => updateStatus(item.id, value)}
                        disabled={updating[item.id]}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="intransit">In Transit</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {updating[item.id] && (
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Updating status...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ${(Number(order?.total || 0) * 0.9).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  ${(Number(order?.total || 0) * 0.1).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ${Number(order?.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">
                Shipping Information
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm space-y-1 text-gray-700">
                <div className="font-medium">
                  {order?.shippingAddress?.line1 ||
                    order?.shippingAddress?.address}
                </div>
                {order?.shippingAddress?.line2 && (
                  <div>{order.shippingAddress.line2}</div>
                )}
                <div>
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.state}{" "}
                  {order?.shippingAddress?.zipCode ||
                    order?.shippingAddress?.postal_code}
                </div>
                <div>{order?.shippingAddress?.country || "USA"}</div>
                <div className="text-gray-600 mt-2 pt-2 border-t">
                  <span className="font-medium">Method:</span>{" "}
                  {order?.shippingMethod || "Standard Shipping"}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Payment Information</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Status</span>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusBadgeColor(
                    order?.paymentStatus || "pending"
                  )} border`}
                >
                  {order?.paymentStatus || "pending"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
