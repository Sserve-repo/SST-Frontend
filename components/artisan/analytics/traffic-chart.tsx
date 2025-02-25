import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrafficData } from "@/types/analytics";

interface TrafficChartProps {
  data: TrafficData;
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Traffic Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyVisitors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="visitors"
                name="Unique Visitors"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {data.sources.map((source) => (
            <div
              key={source.source}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <span className="text-sm font-medium">{source.source}</span>
              <span className="text-sm text-gray-500">{source.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
