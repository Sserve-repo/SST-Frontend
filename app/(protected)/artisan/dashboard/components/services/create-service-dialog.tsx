"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ServiceForm } from "./services-form"
import type { Service } from "@/types/services"

interface CreateServiceDialogProps {
  children: React.ReactNode
  onSubmit: (service: Omit<Service, "id">) => void
}

export function CreateServiceDialog({ children, onSubmit }: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Omit<Service, "id">) => {
    onSubmit(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>
        <ServiceForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

