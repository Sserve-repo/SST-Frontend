"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NotificationForm } from "./notification-form"
import type { Notification } from "@/types/notifications"

interface CreateNotificationDialogProps {
  children: React.ReactNode
}

export function CreateNotificationDialog({ children }: CreateNotificationDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Omit<Notification, "id" | "status" | "stats" | "sentAt" | "createdAt">) => {
    // Handle notification creation here
    console.log("Creating notification:", data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
        </DialogHeader>
        <NotificationForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

