"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { date: "Jan 01", revenue: 4000 },
  { date: "Jan 02", revenue: 3000 },
  { date: "Jan 03", revenue: 5000 },
  { date: "Jan 04", revenue: 2780 },
  { date: "Jan 05", revenue: 1890 },
  { date: "Jan 06", revenue: 2390 },
  { date: "Jan 07", revenue: 3490 },
]

export function RevenueChart() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#5D3A8B"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#5D3A8B" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

