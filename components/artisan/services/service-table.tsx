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
import { EditServiceDialog } from "./edit-services-dialog";
import { DeleteServiceDialog } from "./delete-service-dialog";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import type { Service } from "@/types/services";
import { Card } from "@/components/ui/card";
import { ServiceReviewsPreviewSheet } from "./service-review-preview-sheet";

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
  console.log({ services });
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
                        service.images[0] ||
                        "/assets/images/image-placeholder.png"
                      }
                      alt={service.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">
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
                        ? "bg-green-500"
                        : "bg-red-200"
                    }
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell onClick={() => setSelectedService(service as any)}>
                  <div className="cursor-pointer bg-primary text-white inline-flex justify-center text-center rounded-lg w-12">
                    View
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setServiceToEdit(service)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setServiceToDelete(service)}
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

      <EditServiceDialog
        service={serviceToEdit}
        onOpenChange={(open) => !open && setServiceToEdit(null)}
        onSubmit={(updatedService) => {
          onUpdate(updatedService);
          setServiceToEdit(null);
        }}
      />

      <DeleteServiceDialog
        service={serviceToDelete}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
        onDelete={(id) => {
          onDelete(id);
          setServiceToDelete(null);
        }}
      />

      {selectedService && (
        <ServiceReviewsPreviewSheet
          service={selectedService}
          open={true}
          onOpenChange={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
