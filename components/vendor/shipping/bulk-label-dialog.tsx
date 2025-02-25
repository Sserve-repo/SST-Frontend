"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

interface BulkLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pendingShipments = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: "John Doe",
    items: "2 items",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: "Jane Smith",
    items: "1 item",
  },
];

export function BulkLabelDialog({ open, onOpenChange }: BulkLabelDialogProps) {
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [carrier, setCarrier] = useState("");
  const [service, setService] = useState("");

  const handleSelectAll = () => {
    if (selectedShipments.length === pendingShipments.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(pendingShipments.map((s) => s.id));
    }
  };

  const toggleShipment = (id: string) => {
    if (selectedShipments.includes(id)) {
      setSelectedShipments(selectedShipments.filter((s) => s !== id));
    } else {
      setSelectedShipments([...selectedShipments, id]);
    }
  };

  const generateLabels = () => {
    // Generate labels logic here
    console.log("Generating labels for:", selectedShipments);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Shipping Labels</DialogTitle>
          <DialogDescription>
            Select shipments and carrier to generate labels in bulk.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Shipments</Label>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedShipments.length === pendingShipments.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="space-y-2">
              {pendingShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center space-x-2 rounded-lg border p-4"
                >
                  <Checkbox
                    checked={selectedShipments.includes(shipment.id)}
                    onCheckedChange={() => toggleShipment(shipment.id)}
                  />
                  <div className="grid gap-1">
                    <div className="font-medium">{shipment.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {shipment.customer} • {shipment.items}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Carrier</Label>
                <Select value={carrier} onValueChange={setCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="usps">USPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service Level</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger disabled={!carrier}>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground</SelectItem>
                    <SelectItem value="2day">2-Day</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={generateLabels}
            disabled={!selectedShipments.length || !carrier || !service}
          >
            <Printer className="mr-2 h-4 w-4" />
            Generate {selectedShipments.length} Label(s)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
