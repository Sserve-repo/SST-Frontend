"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface Product {
  orderId: string;
  name: string;
  date: string;
  status: "in-transit" | "delivered" | "cancelled";
}

const products: Product[] = [
  {
    orderId: "#96459761",
    name: "Onamo PowerBank",
    date: "Dec 30, 2019",
    status: "in-transit",
  },
  {
    orderId: "#96459761",
    name: "Onamo PowerBank",
    date: "Dec 30, 2019",
    status: "delivered",
  },
  {
    orderId: "#96459761",
    name: "Onamo PowerBank",
    date: "Dec 30, 2019",
    status: "cancelled",
  },
  {
    orderId: "#96459761",
    name: "Onamo PowerBank",
    date: "Dec 30, 2019",
    status: "delivered",
  },
  {
    orderId: "#96459761",
    name: "Onamo PowerBank",
    date: "Dec 30, 2019",
    status: "delivered",
  },
];

const statusStyles = {
  "in-transit": "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export function RecentProducts() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          Recent Product Ordered
        </CardTitle>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>PRODUCT NAME</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{product.orderId}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusStyles[product.status]}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>Showing 1-5 of 79</span>
          <div className="flex gap-2">
            <button className="p-1">&lt;</button>
            <button className="p-1">&gt;</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
