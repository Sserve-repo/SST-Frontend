import { Card, CardContent } from "@/components/ui/card"
import { Users, Store, Scissors, DollarSign, ShoppingCart } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "24.4k",
    change: "+12%",
    changeType: "increase",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-[#5D3A8B]/10",
  },
  {
    title: "Active Vendors",
    value: "1.2k",
    change: "+8%",
    changeType: "increase",
    icon: Store,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Artisans",
    value: "856",
    change: "+23%",
    changeType: "increase",
    icon: Scissors,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Revenue",
    value: "$842.4k",
    change: "+15%",
    changeType: "increase",
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Pending Orders",
    value: "45",
    change: "-5%",
    changeType: "decrease",
    icon: ShoppingCart,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div
                className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

