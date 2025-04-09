import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import type { OverviewMetrics } from "@/types/analytics"

interface OverviewMetricsProps {
  data: OverviewMetrics
}

const metrics = [
  {
    title: "Total Revenue",
    metric: (data: OverviewMetrics) => data.totalRevenue,
    icon: DollarSign,
    format: (value: number) => `$${value.toLocaleString()}`,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Orders",
    metric: (data: OverviewMetrics) => data.totalOrders,
    icon: ShoppingCart,
    format: (value: number) => value.toLocaleString(),
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Users",
    metric: (data: OverviewMetrics) => data.totalUsers,
    icon: Users,
    format: (value: number) => value.toLocaleString(),
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Average Order Value",
    metric: (data: OverviewMetrics) => data.averageOrderValue,
    icon: TrendingUp,
    format: (value: number) => `$${value.toFixed(2)}`,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
]

export function OverviewMetrics({ data }: OverviewMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.format(metric.metric(data))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

