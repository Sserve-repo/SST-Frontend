"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { UserData } from "@/types/analytics"

interface UserGrowthChartProps {
  data: UserData
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>User Growth</CardTitle>
        <div className="text-sm text-muted-foreground">
          <span className={data.growth >= 0 ? "text-green-600" : "text-red-600"}>
            {data.growth >= 0 ? "+" : ""}
            {data.growth}%
          </span>{" "}
          from last month
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthly}>
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
              <Area type="monotone" dataKey="users" stroke="#5D3A8B" fill="#5D3A8B" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

