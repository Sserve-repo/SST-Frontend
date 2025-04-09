import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { EarningsData } from "@/types/analytics"

interface EarningsOverviewProps {
  data: EarningsData
}

export function EarningsOverview({ data }: EarningsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold">${data.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold">${data.pending}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Paid Out</p>
            <p className="text-2xl font-bold">${data.paid}</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                name="Earnings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

