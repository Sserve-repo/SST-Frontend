"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventOverview } from "./event-overview"
import { EventAttendees } from "./event-attendees"
import type { Event } from "@/types/events/events"

interface EventDetailsDialogProps {
  event: Event | null
  onOpenChange: (open: boolean) => void
}

export function EventDetailsDialog({ event, onOpenChange }: EventDetailsDialogProps) {
  if (!event) return null

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <EventOverview event={event} />
          </TabsContent>
          <TabsContent value="attendees">
            <EventAttendees event={event} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

