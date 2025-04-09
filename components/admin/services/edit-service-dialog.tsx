"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ServiceForm } from "./service-form"
import type { Service } from "@/types/services"

interface EditServiceDialogProps {
  service: Service | null
  onOpenChange: (open: boolean) => void
}

export function EditServiceDialog({ service, onOpenChange }: EditServiceDialogProps) {
  if (!service) return null

  const handleSubmit = (data: Partial<Service>) => {
    // Handle service update here
    console.log("Updating service:", { ...data, id: service.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!service} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <ServiceForm service={service} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

