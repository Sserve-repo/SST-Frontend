"use client";

import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentUpdates = [
  {
    orderNumber: "ORD-2024-001",
    status: "in_transit",
    location: "New York, NY",
    timestamp: "2024-02-24T10:30:00",
    message: "Package in transit to destination",
  },
  {
    orderNumber: "ORD-2024-002",
    status: "processing",
    location: "Los Angeles, CA",
    timestamp: "2024-02-24T09:15:00",
    message: "Label created, package ready for pickup",
  },
  {
    orderNumber: "ORD-2024-003",
    status: "exception",
    location: "Chicago, IL",
    timestamp: "2024-02-24T08:45:00",
    message: "Delivery attempt failed - No access to delivery location",
  },
];

export function TrackingPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tracking Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUpdates.map((update, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div
                className={`rounded-full p-2 ${
                  update.status === "in_transit"
                    ? "bg-blue-50 text-blue-500"
                    : update.status === "processing"
                    ? "bg-yellow-50 text-yellow-500"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{update.orderNumber}</div>
                  <Badge
                    variant={
                      update.status === "in_transit"
                        ? "secondary"
                        : update.status === "processing"
                        ? "outline"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {update.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {update.message}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{update.location}</span>
                  <span>{new Date(update.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
