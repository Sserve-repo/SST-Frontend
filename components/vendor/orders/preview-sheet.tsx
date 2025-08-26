"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Package, CreditCard } from "lucide-react";

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

  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [trackingNoByItem, setTrackingNoByItem] = useState<Record<string, string>>({});
  const [shippingPlatformByItem, setShippingPlatformByItem] = useState<Record<string, string>>({});
  const [platformSelectByItem, setPlatformSelectByItem] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Prefill tracking/platform per item when available from order data
  useEffect(() => {
    try {
      if (Array.isArray(order?.items)) {
        const trackInit: Record<string, string> = {};
        const platInit: Record<string, string> = {};
        const platSelInit: Record<string, string> = {};
        order.items.forEach((item: any) => {
          const id = String(item.id);
          trackInit[id] =
            item?.tracking_no || item?.tracking_id || item?.trackingNumber || "";
          const platRaw = (item?.shipping_platform || item?.courier || "") as string;
          const carriers = ["GIG", "UPS", "DHL", "FedEx", "USPS", "Royal Mail"];
          const matched = carriers.find((c) => c.toLowerCase() === platRaw.toLowerCase());
          platInit[id] = platRaw;
          platSelInit[id] = matched || (platRaw ? "custom" : "");
        });
        setTrackingNoByItem(trackInit);
        setShippingPlatformByItem(platInit);
        setPlatformSelectByItem(platSelInit);
      }
    } catch {}
  }, [order]);

  const getStatusBadgeColor = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
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

  const handleSubmitUpdate = async (itemId: string, currentItemStatus: string) => {
    try {
      setUpdating((prev) => ({ ...prev, [itemId]: true }));

      const statusToSet = (statuses[itemId] || currentItemStatus || "pending").toLowerCase();
      const needsTracking = ["intransit", "delivered"].includes(statusToSet);

      if (needsTracking) {
        const t = (trackingNoByItem[itemId] || "").trim();
        const p = (shippingPlatformByItem[itemId] || "").trim();
        if (!t || !p) {
          toast({
            title: "Missing details",
            description: "Tracking number and shipping platform are required for this status.",
            variant: "destructive",
          });
          return;
        }
      }

      const response = await updateOrderItemStatus(
        itemId,
        statusToSet,
        needsTracking ? trackingNoByItem[itemId] : undefined,
        needsTracking ? shippingPlatformByItem[itemId] : undefined
      );

      if (response?.ok) {
        const result = await response.json();
        if (result.status !== false) {
          setStatuses((prev) => ({ ...prev, [itemId]: statusToSet }));
          toast({ title: "Success", description: "Order item updated" });
          onUpdate?.();
        } else {
          throw new Error(result.message || "Failed to update item");
        }
      } else {
        throw new Error("Failed to update item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update order item",
        variant: "destructive",
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
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
            Placed on {order?.date ? new Date(order.date).toLocaleDateString() : "N/A"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Separator />

          {/* Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Customer Information</h3>
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
              {order?.items?.map((item: any) => {
                const currentStatus = (statuses[item.id] || item.order_status || "pending") as string;
                const showTracking = ["intransit", "delivered"].includes(currentStatus.toLowerCase());

                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {item?.product_name || item?.name || "Unknown Product"}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Qty: {item?.quantity || 1} × ${Number(item?.unit_price || item?.price || 0).toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          Total: ${Number((item?.unit_price || item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Current Status</span>
                        <Badge
                          variant="outline"
                          className={`capitalize ${getStatusBadgeColor(currentStatus)} border`}
                        >
                          {currentStatus}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Shipping Status</label>
                        <Select
                          value={currentStatus}
                          onValueChange={(value) => setStatuses((prev) => ({ ...prev, [item.id]: value }))}
                          disabled={!!updating[item.id]}
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

                        <p className="text-xs text-gray-500">
                          Select In Transit or Delivered to provide tracking details.
                        </p>

                        {showTracking && (
                          <div className="mt-3 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-gray-600">Tracking No</label>
                                <div className="flex gap-2 items-center">
                                  <Input
                                    placeholder="Enter tracking number"
                                    value={trackingNoByItem[item.id] || ""}
                                    onChange={(e) =>
                                      setTrackingNoByItem((prev) => ({ ...prev, [item.id]: e.target.value }))
                                    }
                                  />
                                  {Boolean((trackingNoByItem[item.id] || "").trim()) && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigator.clipboard.writeText(trackingNoByItem[item.id])}
                                      >
                                        Copy
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const q = encodeURIComponent(
                                            `${shippingPlatformByItem[item.id] || ""} ${trackingNoByItem[item.id]}`.trim()
                                          );
                                          window.open(`https://www.google.com/search?q=${q}`, "_blank");
                                        }}
                                      >
                                        Search
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-600">Shipping Platform</label>
                                <Select
                                  value={platformSelectByItem[item.id] || (shippingPlatformByItem[item.id] ? "custom" : "")}
                                  onValueChange={(val) => {
                                    setPlatformSelectByItem((prev) => ({ ...prev, [item.id]: val }));
                                    if (val !== "custom") {
                                      setShippingPlatformByItem((prev) => ({ ...prev, [item.id]: val }));
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select platform" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="UPS">UPS</SelectItem>
                                    <SelectItem value="DHL">DHL</SelectItem>
                                    <SelectItem value="FedEx">FedEx</SelectItem>
                                    <SelectItem value="USPS">USPS</SelectItem>
                                    <SelectItem value="Royal Mail">Royal Mail</SelectItem>
                                    <SelectItem value="GIG">GIG</SelectItem>
                                    <SelectItem value="custom">Custom…</SelectItem>
                                  </SelectContent>
                                </Select>
                                {(platformSelectByItem[item.id] === "custom" || !platformSelectByItem[item.id]) && (
                                  <div className="mt-2">
                                    <Input
                                      placeholder="Enter platform (e.g. GIG, Aramex)"
                                      value={shippingPlatformByItem[item.id] || ""}
                                      onChange={(e) =>
                                        setShippingPlatformByItem((prev) => ({ ...prev, [item.id]: e.target.value }))
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              We’ll save the tracking number and platform with this item so your buyer can track it.
                            </p>
                          </div>
                        )}

                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitUpdate(item.id, currentStatus)}
                            disabled={!!updating[item.id]}
                          >
                            {updating[item.id] ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Updating…
                              </span>
                            ) : (
                              "Update"
                            )}
                          </Button>
                        </div>

                        {updating[item.id] && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating status...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${(Number(order?.total || 0) * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${(Number(order?.total || 0) * 0.1).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${Number(order?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

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
                  className={`capitalize ${getStatusBadgeColor(order?.paymentStatus || "pending")} border`}
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
