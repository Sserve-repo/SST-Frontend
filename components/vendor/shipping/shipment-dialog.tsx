"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Printer, Send, Truck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ShipmentDialogProps {
  shipment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const carriers = [
  { id: "fedex", name: "FedEx", services: ["Ground", "2Day", "Overnight"] },
  { id: "ups", name: "UPS", services: ["Ground", "3Day", "2Day", "Next Day"] },
  { id: "usps", name: "USPS", services: ["Ground", "Priority", "Express"] },
];

export function ShipmentDialog({
  shipment,
  open,
  onOpenChange,
}: ShipmentDialogProps) {
  const [status, setStatus] = useState(shipment.status);
  const [carrier, setCarrier] = useState(shipment.carrier || "");
  const [service, setService] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(
    shipment.trackingNumber || ""
  );
  const [customerNote, setCustomerNote] = useState("");

  const selectedCarrier = carriers.find((c) => c.id === carrier.toLowerCase());

  const generateLabel = () => {
    // Generate shipping label logic here
    console.log("Generating label for shipment:", shipment.id);
  };

  const notifyCustomer = () => {
    // Send notification logic here
    console.log("Notifying customer:", shipment.customer.email);
  };

  const updateShipment = () => {
    // Update shipment details logic here
    console.log("Updating shipment:", {
      id: shipment.id,
      status,
      carrier,
      service,
      trackingNumber,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shipment Details</DialogTitle>
          <DialogDescription>
            Order {shipment.orderNumber} • Created on{" "}
            {new Date(shipment.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {carriers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service Level</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger disabled={!selectedCarrier}>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCarrier?.services.map((s) => (
                    <SelectItem key={s} value={s.toLowerCase()}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Tracking Number</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <Button variant="secondary" onClick={updateShipment}>
                Update
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Shipment Status</Label>
              <Badge variant="outline" className="capitalize">
                {status.replace("_", " ")}
              </Badge>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="exception">Exception</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Customer Notification</Label>
            <Textarea
              placeholder="Add a note to the customer..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              className="w-full"
              variant="outline"
              onClick={notifyCustomer}
              disabled={!customerNote}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Shipping Address</Label>
            <div className="rounded-lg border p-4 text-sm">
              <div>{shipment.customer.name}</div>
              <div>{shipment.shippingAddress.line1}</div>
              {shipment.shippingAddress.line2 && (
                <div>{shipment.shippingAddress.line2}</div>
              )}
              <div>
                {shipment.shippingAddress.city},{" "}
                {shipment.shippingAddress.state}{" "}
                {shipment.shippingAddress.zipCode}
              </div>
              <div>{shipment.shippingAddress.country}</div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Items</Label>
            <div className="space-y-2">
              {shipment.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between rounded-lg border p-4"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground">
                    Quantity: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={generateLabel}>
              <Printer className="mr-2 h-4 w-4" />
              Generate Label
            </Button>
            {trackingNumber && (
              <Button variant="outline" className="flex-1" asChild>
                <a
                  href={`https://track.carrier.com/${trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Track Shipment
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
