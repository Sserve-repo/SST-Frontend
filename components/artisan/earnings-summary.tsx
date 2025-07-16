import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function EarningsSummary({ analytics }) {
  const revenueData = analytics?.statistics?.revenueStats?.map((item) => ({
    month: monthNames[item.month - 1],
    revenue: parseFloat(item.total_revenue),
  }));

  const earningStats = [
    { label: "Total Revenue", value: `$${analytics?.earnings?.totalRevenue}` },
    {
      label: "Pending Payments",
      value: `$${analytics?.earnings?.pendingPayments}`,
    },
    {
      label: "Completed Payouts",
      value: `$${analytics?.earnings?.completedPayouts}`,
    },
  ];

  return (
    <Card className="border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary">Earnings Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            {earningStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#5D3A8B" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EarningsSummary;
