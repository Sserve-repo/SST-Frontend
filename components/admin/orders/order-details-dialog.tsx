"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
// import type { Order } from "@/types/orders"

interface OrderDetailsDialogProps {
  order: any | null
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.id}</span>
            <Badge
              variant="secondary"
              className={cn(
                order.status === "completed" && "bg-green-100 text-green-600",
                order.status === "pending" && "bg-yellow-100 text-yellow-600",
                order.status === "canceled" && "bg-gray-100 text-gray-600",
                order.status === "disputed" && "bg-red-100 text-red-600",
              )}
            >
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <h3 className="font-semibold">Service Details</h3>
            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{order.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">${order.service.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Date</span>
                <span className="font-medium">{new Date(order.bookingDate).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <h3 className="font-semibold">Customer Information</h3>
            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{order.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{order.customer.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <h3 className="font-semibold">Vendor Information</h3>
            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{order.vendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{order.vendor.email}</span>
              </div>
            </div>
          </div>

          {order.dispute && (
            <>
              <Separator />
              <div className="grid gap-2">
                <h3 className="font-semibold">Dispute Information</h3>
                <div className="grid gap-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reason</span>
                    <span className="font-medium">{order.dispute.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        order.dispute.status === "resolved" && "bg-green-100 text-green-600",
                        order.dispute.status === "pending" && "bg-yellow-100 text-yellow-600",
                        order.dispute.status === "rejected" && "bg-red-100 text-red-600",
                      )}
                    >
                      {order.dispute.status}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted-foreground">Description</span>
                    <p className="mt-1">{order.dispute.description}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {order.status === "pending" && (
            <div className="flex justify-end gap-4">
              <Button variant="outline" className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Order
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

