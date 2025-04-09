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
import type { Event } from "@/types/events"

interface DeleteEventDialogProps {
  event: Event | null
  onOpenChange: (open: boolean) => void
}

export function DeleteEventDialog({ event, onOpenChange }: DeleteEventDialogProps) {
  if (!event) return null

  const handleDelete = () => {
    // Handle event deletion here
    console.log("Deleting event:", event.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!event} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone and will notify all
            registered attendees.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete Event
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

