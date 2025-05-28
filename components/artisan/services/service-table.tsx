"use client";

import { useState } from "react";
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
import { ServiceReviewsPreviewSheet } from "./service-review-preview-sheet";
import { EditServicesDialog } from "./edit-services-dialog";

interface ServiceTableProps {
  services: Service[];
  onUpdate: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceTable({
  services,
  onUpdate,
  onDelete,
}: ServiceTableProps) {
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReviewSheetOpen, setIsReviewSheetOpen] = useState(false);

  const handleEditClick = (service: Service) => {
    setServiceToEdit(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleViewReviews = (service: Service) => {
    setSelectedService(service);
    setIsReviewSheetOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => setServiceToEdit(null), 150); // Delay to prevent flash
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setTimeout(() => setServiceToDelete(null), 150);
  };

  const handleReviewSheetClose = () => {
    setIsReviewSheetOpen(false);
    setTimeout(() => setSelectedService(null), 150);
  };

  const handleServiceUpdate = (updatedService: Service) => {
    onUpdate(updatedService);
    handleEditDialogClose();
  };

  const handleServiceDelete = (id: string) => {
    onDelete(id);
    handleDeleteDialogClose();
  };

  return (
    <>
      <Card className="rounded-md border">
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
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        service.images?.[0] ||
                        "/placeholder.svg?height=40&width=40" ||
                        "/placeholder.svg"
                      }
                      alt={service.name}
                      className="h-10 w-10 rounded-md object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=40&width=40";
                      }}
                    />
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {service.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>{service.duration} mins</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      service.status === "active" ? "default" : "secondary"
                    }
                    className={
                      service.status === "active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-200 text-red-800"
                    }
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReviews(service)}
                    className="text-primary hover:bg-primary/10"
                  >
                    View
                  </Button>
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
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <EditServicesDialog
        service={isEditDialogOpen ? serviceToEdit : null}
        onOpenChange={handleEditDialogClose}
        onUpdate={handleServiceUpdate}
      />

      {/* Delete Dialog */}
      <DeleteServiceDialog
        service={isDeleteDialogOpen ? serviceToDelete : null}
        onOpenChange={handleDeleteDialogClose}
        onDelete={handleServiceDelete}
      />

      {/* Review Sheet */}
      {selectedService && (
        <ServiceReviewsPreviewSheet
          service={selectedService}
          open={isReviewSheetOpen}
          onOpenChange={handleReviewSheetClose}
        />
      )}
    </>
  );
}
