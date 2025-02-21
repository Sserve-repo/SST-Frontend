import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Calendar, Star, Tag } from "lucide-react"

const stats = [
  {
    title: "Total Services",
    value: "24",
    change: "+2 this month",
    icon: Scissors,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Upcoming Appointments",
    value: "12",
    change: "3 today",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "New Reviews",
    value: "4.8",
    change: "+12 reviews",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Active Promotions",
    value: "3",
    change: "Ends in 5 days",
    icon: Tag,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsCards