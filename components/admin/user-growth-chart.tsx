"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", vendors: 65, artisans: 45, customers: 145 },
  { month: "Feb", vendors: 75, artisans: 55, customers: 221 },
  { month: "Mar", vendors: 85, artisans: 68, customers: 320 },
  { month: "Apr", vendors: 95, artisans: 78, customers: 420 },
]

export function UserGrowthChart() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Bar dataKey="vendors" fill="#5D3A8B" radius={[12, 12, 0, 0]} />
          <Bar dataKey="artisans" fill="#ff7f02" radius={[12, 12, 0, 0]} />
          <Bar dataKey="customers" fill="#10B981" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

