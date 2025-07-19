"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Loader2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  PendingPayout,
  CompletedPayout,
} from "@/actions/admin/payout-api";

interface PayoutTableProps {
  payouts: (PendingPayout | CompletedPayout)[];
  type: "pending" | "completed";
  onProcessPayout?: (userId: number) => void;
  isProcessing?: boolean;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function PayoutTable({
  payouts,
  type,
  onProcessPayout,
  isProcessing = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: PayoutTableProps) {
  const [payoutToProcess, setPayoutToProcess] = useState<PendingPayout | null>(
    null
  );
  const [showProcessDialog, setShowProcessDialog] = useState(false);

  const formatCurrency = (amount: number | string) => {
    const numAmount =
      typeof amount === "string" ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getUserId = (payout: PendingPayout | CompletedPayout): number => {
    return payout.user_id;
  };

  const getUserName = (payout: PendingPayout | CompletedPayout): string => {
    return payout.user_name;
  };

  const getPayoutType = (payout: PendingPayout | CompletedPayout): string => {
    return payout.payout;
  };

  const getTotalAmount = (payout: PendingPayout | CompletedPayout): number => {
    return typeof payout.total_amount === "string"
      ? Number.parseFloat(payout.total_amount)
      : payout.total_amount;
  };

  const getOrderCount = (payout: PendingPayout | CompletedPayout): number => {
    return payout.total_items || 0;
  };

  const getLatestDate = (payout: PendingPayout | CompletedPayout): string => {
    return payout.latest_date || "";
  };

  const handleProcessPayout = (payout: PendingPayout) => {
    setPayoutToProcess(payout);
    setShowProcessDialog(true);
  };

  const confirmProcessPayout = () => {
    if (payoutToProcess && onProcessPayout) {
      onProcessPayout(payoutToProcess.user_id);
      setShowProcessDialog(false);
      setPayoutToProcess(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Orders/Bookings</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Latest Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout, index) => {
                const userId = getUserId(payout);
                const userName = getUserName(payout);
                const payoutType = getPayoutType(payout);
                const amount = getTotalAmount(payout);
                const date = getLatestDate(payout);

                return (
                  <TableRow
                    key={`${userId}-${index}`}
                    className={isProcessing ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{userName}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {userId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          payoutType === "product" &&
                            "bg-blue-100 text-blue-600",
                          payoutType === "service" &&
                            "bg-purple-100 text-purple-600"
                        )}
                      >
                        {payoutType}
                      </Badge>
                    </TableCell>
                    <TableCell>{getOrderCount(payout)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(amount)}
                    </TableCell>
                    <TableCell>{date ? formatDate(date) : "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          type === "pending" && "bg-yellow-100 text-yellow-600",
                          type === "completed" && "bg-green-100 text-green-600"
                        )}
                      >
                        {type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {type === "pending" && onProcessPayout ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleProcessPayout(payout as PendingPayout)
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                          )}
                          Process Payout
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Completed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process the payout for{" "}
              <strong>{payoutToProcess && getUserName(payoutToProcess)}</strong>{" "}
              of{" "}
              <strong>
                {payoutToProcess &&
                  formatCurrency(getTotalAmount(payoutToProcess))}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmProcessPayout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Payout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
