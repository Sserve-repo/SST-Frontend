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
import type { Service } from "@/types/services"

interface DeleteServiceDialogProps {
  service: Service | null
  onOpenChange: (open: boolean) => void
}

export function DeleteServiceDialog({ service, onOpenChange }: DeleteServiceDialogProps) {
  if (!service) return null

  const handleDelete = () => {
    // Handle service deletion here
    console.log("Deleting service:", service.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!service} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{service.name}&quot;? This action cannot be undone and will
            permanently remove the service from the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete Service
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

