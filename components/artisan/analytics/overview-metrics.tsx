import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Star } from "lucide-react";
import type { OverviewMetrics } from "@/types/analytics";

interface OverviewMetricsProps {
  data: OverviewMetrics;
}

const metrics = [
  {
    title: "Total Bookings",
    metric: (data: OverviewMetrics) => data.totalBookings,
    icon: Users,
    format: (value: number) => value.toString(),
    subtitle: "Total appointments booked",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Revenue",
    metric: (data: OverviewMetrics) => data.totalRevenue,
    icon: DollarSign,
    format: (value: number) => `$${value.toLocaleString()}`,
    subtitle: "Total earnings",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Average Rating",
    metric: (data: OverviewMetrics) => data.averageRating,
    icon: Star,
    format: (value: number) => value.toFixed(1),
    subtitle: "Customer satisfaction",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Conversion Rate",
    metric: (data: OverviewMetrics) => data.conversionRate,
    icon: TrendingUp,
    format: (value: number) => `${value}%`,
    subtitle: "Visits to bookings",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export function OverviewMetrics({ data }: OverviewMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold">
                  {item.format(item.metric(data))}
                </p>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
