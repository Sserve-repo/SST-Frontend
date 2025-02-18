import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PenLine, Trash2 } from "lucide-react"
import { CreateDiscount } from "./CreateDiscount"

export default function DiscountDashboard() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Discounts</h1>
          <CreateDiscount/>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-orange-100 p-2">
                  <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Sales Increase</p>
                  <p className="text-2xl font-bold">$250,000</p>
                  <div className="flex items-center text-sm text-orange-500">
                    <span>+$2,500</span>
                    <span className="ml-2">Revenue Impact</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-purple-100 p-2">
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Most Popular Discount</p>
                  <p className="text-2xl font-bold">Black Friday</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>320</span>
                    <span className="ml-2">Successful Redemptions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-purple-100 p-2">
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Top Selling Item</p>
                  <p className="text-2xl font-bold">Dell Laptop</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    See Top 5
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>DISCOUNT NAME</TableHead>
                  <TableHead>DISCOUNT TYPE</TableHead>
                  <TableHead>DISCOUNT VALUE</TableHead>
                  <TableHead>START DATE</TableHead>
                  <TableHead>END DATE</TableHead>
                  <TableHead>APPLICABLE PRODUCTS</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.type}</TableCell>
                    <TableCell>{discount.value}</TableCell>
                    <TableCell>{discount.startDate}</TableCell>
                    <TableCell>{discount.endDate}</TableCell>
                    <TableCell>{discount.products}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          discount.status === "Active"
                            ? "border-green-500 text-green-500"
                            : discount.status === "Scheduled"
                              ? "border-purple-500 text-purple-500"
                              : "border-red-500 text-red-500"
                        }
                      >
                        {discount.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <PenLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const discounts = [
  {
    id: 1,
    name: "Black Friday",
    type: "Percentage (%)",
    value: "20% off",
    startDate: "Nov 30, 2024",
    endDate: "Dec 30, 2024",
    products: "10 Products",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Summer Sale",
    type: "Fixed Amount",
    value: "$10 off",
    startDate: "Nov 30, 2024",
    endDate: "Dec 30, 2024",
    products: "10 Products",
    status: "Active",
  },
  // Add more sample data as needed
]

