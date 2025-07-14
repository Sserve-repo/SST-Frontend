"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteServiceDialog } from "./delete-service-dialog";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import type { Service } from "@/types/services";
import { Card } from "@/components/ui/card";


import { EditServicesDialog } from "./edit-services-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ServiceTableProps {
  services: Service[];
  onUpdate: (service: Service) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ServiceTable({
  services,
  onUpdate,
  onDelete,
  isLoading = false,
}: ServiceTableProps) {
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const handleEditClick = (service: Service) => {
    setServiceToEdit(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => setServiceToEdit(null), 150);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setTimeout(() => setServiceToDelete(null), 150);
  };

  const handleServiceUpdate = (updatedService: Service) => {
    onUpdate(updatedService);
    handleEditDialogClose();
  };

  const handleServiceDelete = (id: string) => {
    onDelete(id);
    handleDeleteDialogClose();
  };

  const filteredServices = useMemo(() => {
    const filtered = services.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "status")
        return (a.status ?? "").localeCompare(b.status ?? "");
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [services, searchTerm, sortBy]);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredServices.slice(start, start + perPage);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / perPage);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(perPage)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedServices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No services found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          typeof service.images?.[0] === "string"
                            ? service.images[0]
                            : "/assets/images/image-placeholder.png"
                        }
                        alt={service.name}
                        className="h-10 w-10 rounded-md object-cover bg-muted"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "/assets/images/image-placeholder.png")
                        }
                      />
                      <div className="truncate max-w-[200px]">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>{service.duration} mins</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        service.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-200 text-red-800"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(service)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteClick(service)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              Page {currentPage} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <EditServicesDialog
        service={isEditDialogOpen ? serviceToEdit as any : null}
        onOpenChange={handleEditDialogClose}
        onUpdate={handleServiceUpdate}
      />

      <DeleteServiceDialog
        service={isDeleteDialogOpen ? serviceToDelete : null}
        onOpenChange={handleDeleteDialogClose}
        onDelete={handleServiceDelete(serviceToDelete.)}
      />
    </>
  );
}
