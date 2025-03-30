"use client";

import { MdOutlineArrowOutward } from "react-icons/md";
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
import { FaArrowRight } from "react-icons/fa6";
import { convertTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

export function TransactionList({ className, overview }: OverviewProps) {
  const router = useRouter();
  const transaction = overview?.Transaction;

  return (
    <>
      <Card
        className={`rounded-2xl shadow-md p-2 border-none bg-white ${className}`}
        style={{ overflow: "hidden" }}
      >
        <CardHeader className="pb-4">
          <CardTitle className="grid grid-cols-2 md:text-2xl sm:text-xl text-lg justify-between">
            <p>Recent Transaction Details</p>
            <MdOutlineArrowOutward
              className="ml-auto hover:cursor-pointer"
              onClick={() => router.push(`/buyer/dashboard/orders/`)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[600px] lg:min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-sm font-medium text-muted-foreground">
                    ORDER ID NO.
                  </TableHead>
                  <TableHead className="text-left text-sm font-medium text-muted-foreground">
                    DATE
                  </TableHead>
                  <TableHead className="text-left text-sm font-medium text-muted-foreground">
                    ORDER TYPE
                  </TableHead>
                  <TableHead className="text-left text-sm font-medium text-muted-foreground">
                    TOTAL
                  </TableHead>
                  <TableHead className="text-left text-sm font-medium text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction &&
                  transaction.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      onClick={() =>
                        router.push(`/dashboard/orders/${transaction?.id}`)
                      }
                      className="border-none cursor-pointer"
                    >
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          {transaction.order_no}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {convertTime(transaction.created_at)}
                      </TableCell>
                      <TableCell>{transaction.order_type}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        ${transaction.cart_total?.toLocaleString()}
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          router.push(`/dashboard/orders/${transaction?.id}`)
                        }
                        className="text-orange-400"
                      >
                        <div className="flex gap-x-2">
                          View Details
                          <FaArrowRight />
                        </div>
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
    </>
  );
}
