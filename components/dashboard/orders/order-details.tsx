"use client"

import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ORDER_STATUS_MAP, formatCurrency } from "@/lib/order-utils"
import type { OrderDetailsProps } from "@/types/order"
import { useState } from "react"

export function OrderDetails({
  isOpen,
  onClose,
  order,
  userType,
  onAcceptOrder,
  onRejectOrder,
  isLoading,
}: OrderDetailsProps) {
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">#{order.orderNo}</h2>
                <p className="text-sm text-muted-foreground">Today, {new Date().toLocaleTimeString()}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Status</h3>
              <span
                className={`inline-flex rounded-lg px-3 py-1 text-sm font-medium ${ORDER_STATUS_MAP[order.status].color}`}
              >
                {ORDER_STATUS_MAP[order.status].label}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Cost</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span>{formatCurrency(order.total - order.tax - order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-lg font-semibold">Total Price</span>
                <span className="text-lg font-semibold">{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Order Activity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Activity</h3>
              <div className="space-y-4">
                {order.activities.map((activity: any, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <activity.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {userType === "3" && (
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-600"
                  onClick={() => onRejectOrder(order.id)}
                  disabled={isLoading}
                >
                  Reject Request
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowRefundDialog(true)}
                  disabled={isLoading}
                >
                  Accept Request
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You&apos;re about to accept a refund request for this order</DialogTitle>
            <DialogDescription>
              Once you accept this request, the shopper would be refunded and you&apos;d lose the funds for the items
              ordered.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Back
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={async () => {
                await onAcceptOrder(order.id)
                setShowRefundDialog(false)
              }}
              disabled={isLoading}
            >
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

