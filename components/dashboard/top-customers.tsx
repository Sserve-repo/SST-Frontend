"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Customer {
  name: string;
  location: string;
  orderTotal: string;
  amount: string;
}

const customers: Customer[] = Array(5).fill({
  name: "Christina Brooks",
  location: "United States",
  orderTotal: "650 Orders",
  amount: "$250",
});

export function TopCustomers() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Top Customers</CardTitle>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Order Total</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, i) => (
              <TableRow key={i}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.location}</TableCell>
                <TableCell>{customer.orderTotal}</TableCell>
                <TableCell>{customer.amount}</TableCell>
                <TableCell>
                  <Button variant="link" className="text-orange-500 p-0">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>Showing 1-10 of 12</span>
          <div className="flex gap-2">
            <button className="p-1">&lt;</button>
            <button className="p-1">&gt;</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
