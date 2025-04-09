import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "2,543",
    description: "+180 this month",
    icon: Users,
  },
  {
    title: "Active Bookings",
    value: "456",
    description: "+23 from yesterday",
    icon: Calendar,
  },
  {
    title: "Total Revenue",
    value: "$45,231",
    description: "+12.5% from last month",
    icon: DollarSign,
  },
  {
    title: "Active Services",
    value: "24",
    description: "Across 6 categories",
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

