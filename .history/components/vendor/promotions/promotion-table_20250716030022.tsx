"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DeletePromotionDialog } from "./delete-promotion-dialog";
import { EditPromotionDialog } from "./edit-promotion-dialog";
import { PromotionDetailsDialog } from "./promotion-details-dialog";
import type { Promotion } from "@/types/promotions";

interface PromotionTableProps {
  promotions: Promotion[];
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export function PromotionTable({
  promotions,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
<<<<<<< HEAD
=======
  // loading,
>>>>>>> origin/lastest-update
}: PromotionTableProps) {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const getStatusBadge = (status: Promotion["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Upcoming
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Expired
          </Badge>
        );
      case "disabled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Disabled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  const handleView = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setEditDialogOpen(true);
  };

  const handleDelete = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPromotion) {
      onDelete(selectedPromotion.id);
      setDeleteDialogOpen(false);
      setSelectedPromotion(null);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{promotion.name}</div>
                        {promotion.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {promotion.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {promotion.type === "percentage" ? (
                          <Percent className="h-4 w-4 text-blue-600" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        )}
                        <span className="capitalize">
                          {promotion.type.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatValue(promotion.type, promotion.value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{formatDate(promotion.startDate)}</div>
                          <div className="text-muted-foreground">
                            to {formatDate(promotion.endDate)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {promotion.usageCount} / {promotion.usageLimit}
                        </div>
                        <div className="text-muted-foreground">
                          {promotion.usageLimit > 0
                            ? `${Math.round(
                                (promotion.usageCount / promotion.usageLimit) *
                                  100
                              )}% used`
                            : "Unlimited"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(promotion)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(promotion)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(promotion)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex} to {endIndex} of {totalItems} promotions
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && onPageChange(currentPage - 1)
                      }
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => onPageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        onPageChange(currentPage + 1)
                      }
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedPromotion && (
        <>
          <PromotionDetailsDialog
            promotion={selectedPromotion}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
          <EditPromotionDialog
            promotion={selectedPromotion}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={() => {
              setEditDialogOpen(false);
              // Refresh data would be handled by parent component
            }}
          />
          <DeletePromotionDialog
            promotion={selectedPromotion}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  );
}
