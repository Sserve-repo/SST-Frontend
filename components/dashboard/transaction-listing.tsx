"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  product: string;
  amount: number;
  status: "delivered" | "pending" | "rejected";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    product: "Apple Watch",
    amount: 34.95,
    status: "delivered",
    date: "22 Oct, 10:55 AM",
  },
  {
    id: "2",
    product: "Apple Watch",
    amount: 34.95,
    status: "pending",
    date: "22 Oct, 10:55 AM",
  },
  {
    id: "3",
    product: "Apple Watch",
    amount: 34.95,
    status: "delivered",
    date: "22 Oct, 10:55 AM",
  },
  {
    id: "4",
    product: "Apple Watch",
    amount: 34.95,
    status: "rejected",
    date: "22 Oct, 10:55 AM",
  },
];

const statusStyles = {
  delivered: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export function TransactionList({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-2 rounded-sm">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={transaction.product}
                      />
                      <AvatarFallback>AW</AvatarFallback>
                    </Avatar>
                    {transaction.product}
                  </div>
                </TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      statusStyles[transaction.status]
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
