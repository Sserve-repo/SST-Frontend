"use client"

import { useState } from "react"
import { OrderFilters } from "@/components/admin/orders/order-filters"
import { OrderTable } from "@/components/admin/orders/order-table"
import { OrderStats } from "@/components/admin/orders/order-stats"
import type { Order } from "@/types/orders/orders"

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
      },
      service: {
        name: "Hair Styling",
        price: 50,
      },
      vendor: {
        name: "Beauty Studio",
        email: "contact@beautystudio.com",
      },
      status: "pending",
      paymentStatus: "paid",
      total: 50,
      bookingDate: "2024-02-25T10:00:00",
      createdAt: "2024-02-20T15:30:00",
      notes: "First time customer",
      dispute: null,
    },
    {
      id: "ORD002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891",
      },
      service: {
        name: "Deep Tissue Massage",
        price: 80,
      },
      vendor: {
        name: "Wellness Center",
        email: "info@wellnesscenter.com",
      },
      status: "completed",
      paymentStatus: "paid",
      total: 80,
      bookingDate: "2024-02-24T14:00:00",
      createdAt: "2024-02-19T09:15:00",
      notes: "Regular customer",
      dispute: null,
    },
    {
      id: "ORD003",
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1234567892",
      },
      service: {
        name: "Nail Art",
        price: 35,
      },
      vendor: {
        name: "Nail Paradise",
        email: "hello@nailparadise.com",
      },
      status: "disputed",
      paymentStatus: "refund_pending",
      total: 35,
      bookingDate: "2024-02-23T11:00:00",
      createdAt: "2024-02-18T16:45:00",
      notes: "",
      dispute: {
        reason: "Service not as described",
        description: "The nail art design was different from what was shown in the catalog.",
        status: "pending",
        createdAt: "2024-02-23T12:30:00",
      },
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Orders & Bookings</h1>
        <p className="text-muted-foreground">Manage customer orders and service bookings</p>
      </div>

      <OrderStats orders={orders} />
      <OrderFilters />
      <OrderTable orders={orders} />
    </div>
  )
}

