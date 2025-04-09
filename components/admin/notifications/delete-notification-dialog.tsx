"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Notification } from "@/types/notifications/notifications"

interface DeleteNotificationDialogProps {
  notification: Notification | null
  onOpenChange: (open: boolean) => void
}

export function DeleteNotificationDialog({ notification, onOpenChange }: DeleteNotificationDialogProps) {
  if (!notification) return null

  const handleDelete = () => {
    // Handle notification deletion here
    console.log("Deleting notification:", notification.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!notification} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Notification</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this notification? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

