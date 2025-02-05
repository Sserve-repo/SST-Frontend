"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isCustomOrder } from "@/lib/order-utils";
import type { OrderActionsProps, OrderStatus } from "@/types/order";

export function RoleActions({
  order,
  userType,
  onStatusChange,
  onAcceptOrder,
  onRejectOrder,
  isLoading,
}: OrderActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Shopper can only cancel pending orders
  const renderShopperActions = () => {
    if (order.status === "pending") {
      return (
        <Button
          variant="destructive"
          onClick={() => onStatusChange(order.id, "cancelled")}
          disabled={isLoading}
        >
          Cancel Order
        </Button>
      );
    }
    return null;
  };

  // Vendor can accept/reject orders and update status
  const renderVendorActions = () => {
    if (order.status === "pending") {
      return (
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoading}
          >
            Accept Order
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => onRejectOrder(order.id)}
            disabled={isLoading}
          >
            Reject Order
          </Button>
        </div>
      );
    }

    if (order.status !== "cancelled" && order.status !== "delivered") {
      return (
        <Button
          className="w-full"
          onClick={() => setShowStatusDialog(true)}
          disabled={isLoading}
        >
          Update Status
        </Button>
      );
    }

    return null;
  };

  // Artisan has additional custom order handling
  const renderArtisanActions = () => {
    const actions = renderVendorActions();
    if (isCustomOrder(order) && order.status === "pending") {
      return (
        <div className="space-y-4">
          {actions}
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              /* Handle custom order details */
            }}
            disabled={isLoading}
          >
            View Custom Specifications
          </Button>
        </div>
      );
    }
    return actions;
  };

  const renderActions = () => {
    switch (userType) {
      case "2":
        return renderShopperActions();
      case "3":
        return renderVendorActions();
      case "4":
        return renderArtisanActions();
      default:
        return null;
    }
  };

  return (
    <>
      {renderActions()}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this order? You&apos;ll be
              expected to fulfill it according to the specified timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onAcceptOrder(order.id);
                setShowConfirmDialog(false);
              }}
              disabled={isLoading}
            >
              Accept
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <Select
            onValueChange={async (value: OrderStatus) => {
              await onStatusChange(order.id, value);
              setShowStatusDialog(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
    </>
  );
}
