"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { OverviewProps } from "./overview";

const statusStyles = {
  delivered: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  cancelled: "bg-red-100 text-red-600",
};

export type TransactionType = {
  id: string;
  order_no: string;
  user_id: string;
  total: string;
  vendor_tax: string;
  shipping_cost: string;
  cart_total: string;
  order_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export function TransactionList({
  className,
  overview,
  tab,
}: OverviewProps) {
  const transaction = overview?.Transaction;

  return (
    <>
      {tab === "products" ? (
        <Card
          className={`rounded-2xl shadow-md p-2 border-none bg-white ${className}`}
          style={{ overflow: "hidden" }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="md:text-2xl sm:text-xl text-lg">
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[600px] lg:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Product Name
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Amount
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction &&
                    transaction.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-none cursor-pointer"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Product"
                              />
                              <AvatarFallback>AW</AvatarFallback>
                            </Avatar>
                            {transaction.order_no}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          ${transaction.cart_total?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusStyles[transaction.status]
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {transaction.created_at}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <span>Showing 1-05 of {transaction?.length}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`rounded-2xl shadow-md p-2 border-none bg-white ${className}`}
          style={{ overflow: "hidden" }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="md:text-2xl sm:text-xl text-lg">
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[600px] lg:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Service Name
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Amount
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction &&
                    transaction.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-none cursor-pointer"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Product"
                              />
                              <AvatarFallback>AW</AvatarFallback>
                            </Avatar>
                            {transaction.order_no}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          ${transaction.cart_total?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusStyles[transaction.status]
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {transaction.created_at}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <span>Showing 1-05 of {transaction?.length}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
