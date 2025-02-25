import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight } from "lucide-react"

const transactions = [
  {
    id: "#96439701",
    date: "Dec 30, 2019, 07:52",
    type: "Product",
    total: "$159",
  },
  {
    id: "#7367167",
    date: "Dec 7, 2019, 23:26",
    type: "Product",
    total: "$70",
  },
  {
    id: "#95244362",
    date: "Dec 7, 2019, 23:26",
    type: "Service",
    total: "$2,300",
  },
  {
    id: "#7367167",
    date: "Feb 2, 2019, 19:28",
    type: "Product",
    total: "$250",
  },
  {
    id: "#95174635",
    date: "Dec 30, 2019, 07:52",
    type: "Product",
    total: "$360",
  },
]

export function TransactionTable() {
  return (
    <Card className="border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transaction Details</h2>
          <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-gray-500">ORDER ID NO</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">DATE</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">ORDER TYPE</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">TOTAL</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 text-right">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.total}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

