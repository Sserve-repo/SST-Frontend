import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const services = [
  {
    name: "Hair Styling",
    bookings: 245,
    revenue: "$12,450",
    growth: 85,
  },
  {
    name: "Nail Care",
    bookings: 190,
    revenue: "$9,500",
    growth: 65,
  },
  {
    name: "Massage",
    bookings: 175,
    revenue: "$8,750",
    growth: 55,
  },
  {
    name: "Makeup",
    bookings: 165,
    revenue: "$8,250",
    growth: 45,
  },
]

export function TopServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">{service.name}</p>
                <span className="text-sm text-muted-foreground">{service.revenue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={service.growth} className="h-2" />
                <span className="text-sm text-muted-foreground">{service.growth}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

