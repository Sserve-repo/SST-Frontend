"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  DollarSign,
  Loader2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  PendingPayout,
  CompletedPayout,
} from "@/actions/admin/payout-api";
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

interface PayoutTableProps {
  payouts: (PendingPayout | CompletedPayout)[];
  type: "pending" | "completed";
  onProcessPayout?: (userId: number) => void;
  isProcessing?: boolean;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

export function PayoutTable({
  payouts,
  type,
  onProcessPayout,
  isProcessing = false,
  selectedIds,
  onSelectedIdsChange,
}: PayoutTableProps) {
  const [payoutToProcess, setPayoutToProcess] = useState<PendingPayout | null>(
    null
  );
  const [showProcessDialog, setShowProcessDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserId = (payout: PendingPayout | CompletedPayout) => {
    return payout.vendor_id || payout.artisan_id || 0;
  };

  const getUserName = (payout: PendingPayout | CompletedPayout) => {
    return payout.vendor_name || payout.artisan_name || "Unknown";
  };

  const getLatestDate = (payout: PendingPayout | CompletedPayout) => {
    return payout.latest_order_date || payout.latest_booking_date || "";
  };

  const getOrderCount = (payout: PendingPayout | CompletedPayout) => {
    return payout.total_orders || payout.total_bookings || 0;
  };

  const toggleAll = () => {
    if (selectedIds.length === payouts.length) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange(
        payouts.map((payout) => getUserId(payout).toString())
      );
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((payoutId) => payoutId !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  const handleProcessPayout = (payout: PendingPayout) => {
    setPayoutToProcess(payout);
    setShowProcessDialog(true);
  };

  const confirmProcessPayout = () => {
    if (payoutToProcess && onProcessPayout) {
      onProcessPayout(getUserId(payoutToProcess));
      setShowProcessDialog(false);
      setPayoutToProcess(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === payouts.length && payouts.length > 0
                  }
                  onCheckedChange={toggleAll}
                  disabled={isProcessing}
                />
              </TableHead> */}
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
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout, index) => {
                const userId = getUserId(payout).toString();
                return (
                  <TableRow
                    key={`${userId}-${index}`}
                    className={isProcessing ? "opacity-50" : ""}
                  >
                    {/* <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(userId)}
                        onCheckedChange={() => toggleOne(userId)}
                        disabled={isProcessing}
                      />
                    </TableCell> */}
                    <TableCell>
                      <div>
                        <p className="font-medium">{getUserName(payout)}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {getUserId(payout)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          payout.type === "product" &&
                            "bg-blue-100 text-blue-600",
                          payout.type === "service" &&
                            "bg-purple-100 text-purple-600"
                        )}
                      >
                        {payout.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{getOrderCount(payout)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payout.total_amount)}
                    </TableCell>
                    <TableCell>
                      {getLatestDate(payout)
                        ? formatDate(getLatestDate(payout))
                        : "N/A"}
                    </TableCell>
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
                      {type === "pending" && onProcessPayout && (
                        <Button
                          variant={"outline"}
                          size={"sm"}
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
                      )}
                      {type === "completed" && (
                        <Button variant={"outline"} size={"sm"} disabled>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Completed
                        </Button>
                      )}
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isProcessing}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {type === "pending" && onProcessPayout && (
                            <DropdownMenuItem
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
                            </DropdownMenuItem>
                          )}
                          {type === "completed" && (
                            <DropdownMenuItem disabled>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Completed
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process the payout for{" "}
              {payoutToProcess && getUserName(payoutToProcess)} of{" "}
              {payoutToProcess && formatCurrency(payoutToProcess.total_amount)}?
              This action cannot be undone.
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
