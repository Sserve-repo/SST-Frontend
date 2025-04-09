"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EventForm } from "./event-form"
import type { Event } from "@/types/events/events"

interface CreateEventDialogProps {
  children: React.ReactNode
}

export function CreateEventDialog({ children }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Omit<Event, "id" | "attendees" | "createdAt">) => {
    // Handle event creation here
    console.log("Creating event:", data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <EventForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

