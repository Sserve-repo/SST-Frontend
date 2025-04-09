import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, ArrowUpRight, RefreshCw } from "lucide-react";
// import type { EngagementData } from "@/types/analytics"

interface EngagementData {
  activeUsers: string;
  sessionDuration: string;
  bounceRate: string;
  returnRate: string;
}
interface EngagementMetricsProps {
  data: EngagementData;
}

const metrics = [
  {
    title: "Active Users",
    value: (data: EngagementData) => data.activeUsers.toLocaleString(),
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Avg. Session Duration",
    value: (data: EngagementData) => data.sessionDuration,
    icon: Clock,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Bounce Rate",
    value: (data: EngagementData) => data.bounceRate,
    icon: ArrowUpRight,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Return Rate",
    value: (data: EngagementData) => data.returnRate,
    icon: RefreshCw,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export function EngagementMetrics({ data }: EngagementMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-lg font-semibold">{metric.value(data)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
