"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/services";

interface ServiceDetailsDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailsDialog({
  service,
  onOpenChange,
}: ServiceDetailsDialogProps) {
  if (!service) return null;

  return (
    <Dialog open={!!service} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={service.images[0] || "/placeholder.svg"}
              alt={service.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <Badge
                variant="secondary"
                className={cn(
                  service.status === "approved" &&
                    "bg-green-100 text-green-600",
                  service.status === "pending" &&
                    "bg-yellow-100 text-yellow-600",
                  service.status === "rejected" && "bg-red-100 text-red-600"
                )}
              >
                {service.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{service.description}</p>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Category</span>
              <span>{service.category}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Price</span>
              <span>${service.price}</span>
            </div>
            {service.vendor && (
              <>
                <div className="flex justify-between border-b py-2">
                  <span className="font-medium">Vendor</span>
                  <span>{service?.vendor.name}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="font-medium">Vendor Email</span>
                  <span>{service?.vendor.email}</span>
                </div>
              </>
            )}
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Created Date</span>
              <span>{new Date(service.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Featured</span>
              <span>{service.featured ? "Yes" : "No"}</span>
            </div>
          </div>

          {service.status === "pending" && (
            <div className="flex justify-end gap-4">
              <Button variant="outline" className="text-red-600">
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
