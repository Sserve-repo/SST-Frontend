import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ServicesAnalytics } from "@/types/analytics";

interface ServiceAnalyticsProps {
  data: ServicesAnalytics;
}

export function ServiceAnalytics({ data }: ServiceAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Service Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Services</p>
            <p className="text-2xl font-bold">{data.totalServices}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Active Services</p>
            <p className="text-2xl font-bold">{data.activeServices}</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.serviceBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
