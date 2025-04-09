import { Card, CardContent } from "@/components/ui/card"
import { Target, TrendingUp, Users, DollarSign } from "lucide-react"
import type { Campaign } from "@/types/marketing"

interface CampaignStatsProps {
  campaigns: Campaign[]
}

const stats = [
  {
    title: "Total Campaigns",
    value: (campaigns: Campaign[]) => campaigns.length,
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Campaigns",
    value: (campaigns: Campaign[]) => campaigns.filter((c) => c.status === "active").length,
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Conversions",
    value: (campaigns: Campaign[]) =>
      campaigns.reduce((acc, campaign) => acc + (campaign.performance?.conversions || 0), 0),
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Total Revenue",
    value: (campaigns: Campaign[]) =>
      campaigns.reduce((acc, campaign) => acc + (campaign.performance?.revenue || 0), 0),
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    format: (value: number) => `$${value.toLocaleString()}`,
  },
]

export function CampaignStats({ campaigns }: CampaignStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">
                  {stat.format ? stat.format(stat.value(campaigns)) : stat.value(campaigns)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

