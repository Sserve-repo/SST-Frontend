"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Campaign } from "@/types/marketing"

interface CampaignPerformanceViewProps {
  campaign: Campaign
}

export function CampaignPerformanceView({ campaign }: CampaignPerformanceViewProps) {
  if (!campaign.performance) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">No performance data available yet</p>
      </div>
    )
  }

  // Sample daily data - In a real app, this would be actual time-series data
  const dailyData = [
    { date: "Day 1", impressions: 2500, conversions: 125, revenue: 6250 },
    { date: "Day 2", impressions: 3000, conversions: 150, revenue: 7500 },
    { date: "Day 3", impressions: 3500, conversions: 175, revenue: 8750 },
    { date: "Day 4", impressions: 4000, conversions: 200, revenue: 10000 },
    { date: "Day 5", impressions: 4500, conversions: 225, revenue: 11250 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.performance.ctr}%</div>
            <p className="text-xs text-muted-foreground">
              {campaign.performance.clicks} clicks from {campaign.performance.impressions} impressions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.performance.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {campaign.performance.conversions} conversions from {campaign.performance.clicks} clicks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaign.performance.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${(campaign.performance.revenue / campaign.performance.conversions).toFixed(2)} per conversion
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
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
                <Line type="monotone" dataKey="conversions" stroke="#5D3A8B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impressions Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
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
                <Area type="monotone" dataKey="impressions" stroke="#5D3A8B" fill="#5D3A8B" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

