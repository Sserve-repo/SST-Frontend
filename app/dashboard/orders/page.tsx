import { Metadata } from "next"
import { Filter } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Orders | Dashboard",
}

interface Order {
  id: string
  name: string
  address: string
  orderType: "Product" | "Service"
  date: string
  type: string
  status: "Completed" | "Processing" | "Rejected" | "On Hold" | "In Transit"
}

const orders: Order[] = [
  {
    id: "01",
    name: "Christine Brooks",
    address: "089 Mutch Green Apt. 448",
    orderType: "Product",
    date: "04 Sep 2019",
    type: "Electric",
    status: "Completed",
  },
  {
    id: "02",
    name: "Rosie Pearson",
    address: "979 Immanuel Ferry Suite 526",
    orderType: "Product",
    date: "28 May 2019",
    type: "Book",
    status: "Processing",
  },
  {
    id: "03",
    name: "Darrell Caldwell",
    address: "8587 Frida Ports",
    orderType: "Service",
    date: "23 Nov 2019",
    type: "Medicine",
    status: "Rejected",
  },
  {
    id: "04",
    name: "Gilbert Johnston",
    address: "768 Destiny Lake Suite 600",
    orderType: "Product",
    date: "05 Feb 2019",
    type: "Mobile",
    status: "Completed",
  },
  {
    id: "05",
    name: "Alan Cain",
    address: "042 Mylene Throughway",
    orderType: "Service",
    date: "29 Jul 2019",
    type: "Watch",
    status: "Processing",
  },
  {
    id: "06",
    name: "Alfred Murray",
    address: "543 Weimann Mountain",
    orderType: "Service",
    date: "15 Aug 2019",
    type: "Medicine",
    status: "Completed",
  },
  {
    id: "07",
    name: "Maggie Sullivan",
    address: "New Scottieberg",
    orderType: "Service",
    date: "21 Dec 2019",
    type: "Watch",
    status: "Processing",
  },
  {
    id: "08",
    name: "Rosie Todd",
    address: "New Jon",
    orderType: "Service",
    date: "30 Apr 2019",
    type: "Medicine",
    status: "On Hold",
  },
  {
    id: "09",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    orderType: "Product",
    date: "09 Jan 2019",
    type: "Book",
    status: "In Transit",
  },
]

const statusStyles = {
  Completed: "bg-emerald-100 text-emerald-800",
  Processing: "bg-purple-100 text-purple-800",
  Rejected: "bg-red-100 text-red-800",
  "On Hold": "bg-orange-100 text-orange-800",
  "In Transit": "bg-blue-100 text-blue-800",
}

export default function OrdersPage() {
  return (
    <div className="flex flex-col space-y-6 py-2 p-1 md:p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order Lists</h1>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="sm:flex hidden flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter By</span>
          </div>

          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="destructive" size="sm" className="ml-auto whitespace-nowrap">
              Reset Filter
            </Button>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>ADDRESS</TableHead>
                <TableHead>ORDER TYPE</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.orderType}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusStyles[order.status as keyof typeof statusStyles]}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            Showing 1-09 of 78
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

