import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const products = [
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

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">{product.name}</p>
                <span className="text-sm text-muted-foreground">{product.revenue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={product.growth} className="h-2" />
                <span className="text-sm text-muted-foreground">{product.growth}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{product.bookings} bookings</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

