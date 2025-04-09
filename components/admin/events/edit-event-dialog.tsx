"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventForm } from "./event-form"
import type { Event } from "@/types/events/events"

interface EditEventDialogProps {
  event: Event | null
  onOpenChange: (open: boolean) => void
}

export function EditEventDialog({ event, onOpenChange }: EditEventDialogProps) {
  if (!event) return null

  const handleSubmit = (data: Omit<Event, "id" | "attendees" | "createdAt">) => {
    // Handle event update here
    console.log("Updating event:", { ...data, id: event.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <EventForm event={event} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

