"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ServiceForm } from "./services-form"
import type { Service } from "@/types/services"

interface EditServiceDialogProps {
  service: Service | null
  onOpenChange: (open: boolean) => void
  onSubmit: (service: Service) => void
}

export function EditServiceDialog({ service, onOpenChange, onSubmit }: EditServiceDialogProps) {
  if (!service) return null

  return (
    <Dialog open={!!service} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <ServiceForm service={service} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

