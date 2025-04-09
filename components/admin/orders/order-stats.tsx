import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle, RefreshCcw } from "lucide-react"
import type { Order } from "@/types/order"

interface OrderStatsProps {
  orders: Order[]
}

const stats = [
  {
    title: "Pending Orders",
    value: (orders: Order[]) => orders.filter((order) => order.status === "pending").length,
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Completed Orders",
    value: (orders: Order[]) => orders.filter((order) => order.status === "completed").length,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Disputed Orders",
    value: (orders: Order[]) => orders.filter((order) => order.status === "disputed").length,
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Pending Refunds",
    value: (orders: Order[]) => orders.filter((order) => order.paymentStatus === "refund_pending").length,
    icon: RefreshCcw,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

export function OrderStats({ orders }: OrderStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value(orders)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

