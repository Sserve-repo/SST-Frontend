import { Card } from "@/components/ui/card";
import { Users, Package, Truck, XCircle } from "lucide-react";
import type { OrderMetrics } from "@/types/order";

interface MetricsCardsProps {
  metrics: OrderMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Total Customer",
      value: metrics.totalCustomers ? metrics.totalCustomers.value : 0,
      icon: <Users className="h-6 w-6 text-purple-500" />,
      trend: metrics.totalCustomers ? metrics.totalCustomers.trend : 0,
      trendText: metrics.totalCustomers ? metrics.totalCustomers.trendText : '',
      iconBg: "bg-purple-50",
    },
    {
      title: "Total Product Delivered",
      value: metrics.totalDelivered,
      icon: <Package className="h-6 w-6 text-emerald-500" />,
      trend: metrics.totalDelivered ? metrics.totalDelivered.trend : 0,
      trendText: metrics.totalDelivered ? metrics.totalDelivered.trendText : '',
      iconBg: "bg-emerald-50",
    },
    {
      title: "Order In-Transit",
      value: metrics.ordersInTransit ? metrics.ordersInTransit.value : 0,
      icon: <Truck className="h-6 w-6 text-blue-500" />,
      trend: metrics.ordersInTransit ? metrics.ordersInTransit.trend : 0,
      trendText: metrics.ordersInTransit ? metrics.ordersInTransit.trendText : '',
      iconBg: "bg-blue-50",
    },
    {
      title: "Cancelled Orders",
      value: metrics.cancelledOrders.value,
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      trend: metrics.cancelledOrders.trend,
      trendText: metrics.cancelledOrders.trendText,
      iconBg: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`rounded-xl ${card.iconBg} p-4`}>{card.icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <h3 className="text-2xl font-semibold">{card.value as string}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`text-sm font-medium ${card.trend > 0 ? "text-emerald-600" : "text-red-600"
                }`}
            >
              {card.trend > 0 ? "+" : ""}
              {card.trend}%
            </span>
            <span className="text-sm text-muted-foreground">
              {card.trendText}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
