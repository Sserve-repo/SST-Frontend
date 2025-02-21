"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { RegistrationDialog } from "./registration-dialog"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/events"

interface EventDetailsDialogProps {
  event: Event | null
  onOpenChange: (open: boolean) => void
  onRegister: (eventId: string) => void
}

export function EventDetailsDialog({ event, onOpenChange, onRegister }: EventDetailsDialogProps) {
  const [showRegistration, setShowRegistration] = useState(false)

  if (!event) return null

  return (
    <>
      <Dialog open={!!event} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover w-full h-full" />
              <Badge
                className={cn(
                  "absolute top-2 right-2",
                  event.status === "upcoming" && "bg-green-500",
                  event.status === "full" && "bg-orange-500",
                  event.status === "completed" && "bg-gray-500",
                )}
              >
                {event.status === "upcoming" && `${event.capacity - event.registered} spots left`}
                {event.status === "full" && "Fully Booked"}
                {event.status === "completed" && "Completed"}
              </Badge>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.instructor.image} />
                  <AvatarFallback>{event.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.instructor.name}</p>
                  <p className="text-sm text-gray-500">{event.instructor.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{event.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{event.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {event.registered} registered out of {event.capacity} spots
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">About this event</h4>
                <p className="text-gray-500">{event.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What you will learn</h4>
                <ul className="grid gap-1">
                  {event.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-gray-500">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold">${event.price}</p>
                </div>
                <Button onClick={() => setShowRegistration(true)} disabled={event.status !== "upcoming"}>
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RegistrationDialog
        event={event}
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onConfirm={() => {
          onRegister(event.id)
          setShowRegistration(false)
        }}
      />
    </>
  )
}

