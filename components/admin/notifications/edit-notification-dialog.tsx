"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NotificationForm } from "./notification-form"
import type { Notification } from "@/types/notifications/notifications"

interface EditNotificationDialogProps {
  notification: Notification | null
  onOpenChange: (open: boolean) => void
}

export function EditNotificationDialog({ notification, onOpenChange }: EditNotificationDialogProps) {
  if (!notification) return null

  const handleSubmit = (data: Omit<Notification, "id" | "status" | "stats" | "sentAt" | "createdAt">) => {
    // Handle notification update here
    console.log("Updating notification:", { ...data, id: notification.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!notification} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Notification</DialogTitle>
        </DialogHeader>
        <NotificationForm notification={notification} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

