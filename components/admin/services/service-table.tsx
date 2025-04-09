"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Edit, Eye, MoreHorizontal, Star, Trash2, X } from "lucide-react"
import { ServiceDetailsDialog } from "./service-details-dialog"
import { EditServiceDialog } from "./edit-service-dialog"
import { DeleteServiceDialog } from "./delete-service-dialog"
import { cn } from "@/lib/utils"
import type { Service } from "@/types/services"

interface ServiceTableProps {
  services: Service[]
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
}

export function ServiceTable({ services, selectedIds, onSelectedIdsChange }: ServiceTableProps) {
  const [serviceToView, setServiceToView] = useState<Service | null>(null)
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  const toggleAll = () => {
    if (selectedIds.length === services.length) {
      onSelectedIdsChange([])
    } else {
      onSelectedIdsChange(services.map((service: any) => service.id))
    }
  }

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((serviceId) => serviceId !== id))
    } else {
      onSelectedIdsChange([...selectedIds, id])
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={selectedIds.length === services.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service: any) => (
              <TableRow key={service.id}>
                <TableCell>
                  <Checkbox checked={selectedIds.includes(service.id)} onCheckedChange={() => toggleOne(service.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={service.images[0] || "/placeholder.svg"}
                      alt={service.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{service.vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{service.vendor.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      service.status === "approved" && "bg-green-100 text-green-600",
                      service.status === "pending" && "bg-yellow-100 text-yellow-600",
                      service.status === "rejected" && "bg-red-100 text-red-600",
                    )}
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setServiceToView(service)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setServiceToEdit(service)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Service
                      </DropdownMenuItem>
                      {service.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <X className="mr-2 h-4 w-4 text-red-600" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4 text-yellow-600" />
                        {service.featured ? "Unfeature" : "Feature"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setServiceToDelete(service)} className="text-red-600">
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

      <ServiceDetailsDialog service={serviceToView} onOpenChange={(open) => !open && setServiceToView(null)} />

      <EditServiceDialog service={serviceToEdit} onOpenChange={(open) => !open && setServiceToEdit(null)} />

      <DeleteServiceDialog service={serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)} />
    </>
  )
}

