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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Printer, Send, Tag, Truck } from "lucide-react";

interface OrderPreviewSheetProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderPreviewSheet({
  order,
  open,
  onOpenChange,
}: OrderPreviewSheetProps) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    // Update order status logic here
    console.log("Updating status to:", newStatus);
  };

  const updateTracking = () => {
    // Update tracking number logic here
    console.log("Updating tracking number to:", trackingNumber);
  };

  const printInvoice = () => {
    // Print invoice logic here
    console.log("Printing invoice for order:", order.id);
  };

  const emailInvoice = () => {
    // Email invoice logic here
    console.log("Emailing invoice to:", order.customer.email);
  };

  const createLabel = () => {
    // Create shipping label logic here
    console.log("Creating shipping label for order:", order.id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Order {order.orderNumber}</SheetTitle>
          <SheetDescription>
            Placed on {new Date(order.date).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Order Status</h3>
              <Badge variant="outline" className="capitalize">
                {status}
              </Badge>
            </div>
            <Select value={status} onValueChange={updateStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Customer Information</h3>
            <div className="text-sm">
              <div>{order.customer.name}</div>
              <div className="text-muted-foreground">
                {order.customer.email}
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <div>{item.name}</div>
                    <div className="text-muted-foreground">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <div>Total</div>
                <div>${order.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Shipping Information</h3>
            <div className="text-sm space-y-1">
              <div>{order.shippingAddress.line1}</div>
              {order.shippingAddress.line2 && (
                <div>{order.shippingAddress.line2}</div>
              )}
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </div>
              <div>{order.shippingAddress.country}</div>
              <div className="text-muted-foreground mt-2">
                Method: {order.shippingMethod}
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Tracking Information</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <Button variant="secondary" onClick={updateTracking}>
                Update
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={printInvoice}>
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
              <Button variant="outline" onClick={emailInvoice}>
                <Send className="mr-2 h-4 w-4" />
                Email Invoice
              </Button>
              <Button variant="outline" onClick={createLabel}>
                <Tag className="mr-2 h-4 w-4" />
                Create Label
              </Button>
              {trackingNumber && (
                <Button variant="outline" asChild>
                  <a
                    href={`https://track.carrier.com/${trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Track Order
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
