"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react"
import { OrderDetailsDialog } from "./order-details-dialog"
import { RefundDialog } from "./refund-dialog"
import { DisputeDialog } from "./dispute-dialog"
import { cn } from "@/lib/utils"
import type { Order } from "@/types/order"

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  const [orderToView, setOrderToView] = useState<Order | null>(null)
  const [orderToRefund, setOrderToRefund] = useState<Order | null>(null)
  const [orderToDispute, setOrderToDispute] = useState<Order | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.service.name}</p>
                    <p className="text-sm text-muted-foreground">${order.service.price}</p>
                  </div>
                </TableCell>
                <TableCell>{order.vendor.name}</TableCell>
                <TableCell>{new Date(order.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      order.paymentStatus === "paid" && "bg-green-100 text-green-600",
                      order.paymentStatus === "pending" && "bg-yellow-100 text-yellow-600",
                      order.paymentStatus === "refunded" && "bg-gray-100 text-gray-600",
                      order.paymentStatus === "refund_pending" && "bg-orange-100 text-orange-600",
                    )}
                  >
                    {order.paymentStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setOrderToView(order)}>View Details</DropdownMenuItem>
                      {order.status === "pending" && (
                        <>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Confirm Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            Cancel Order
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setOrderToRefund(order)}>Process Refund</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOrderToDispute(order)}>
                        {order.dispute ? "View Dispute" : "Raise Dispute"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsDialog order={orderToView} onOpenChange={(open) => !open && setOrderToView(null)} />

      <RefundDialog order={orderToRefund} onOpenChange={(open) => !open && setOrderToRefund(null)} />

      <DisputeDialog order={orderToDispute} onOpenChange={(open) => !open && setOrderToDispute(null)} />
    </>
  )
}

