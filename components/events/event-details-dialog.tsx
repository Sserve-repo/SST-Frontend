"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import type { Event } from "@/types/events";

interface EventDetailsDialogProps {
  event: Event | null;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({
  event,
  onOpenChange,
}: EventDetailsDialogProps) {
  if (!event) return null;

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "ongoing":
        return "bg-green-100 text-green-600";
      case "completed":
        return "bg-gray-100 text-gray-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          <div className="relative">
            <img
              src={event.image || "/placeholder.svg?height=300&width=600"}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge
              className={`absolute top-2 right-2 ${getStatusColor(
                event.status
              )}`}
            >
              {event.status}
            </Badge>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm">
                    {event.startDate.toLocaleDateString()} -{" "}
                    {event.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm">{event.location}</p>
                  <p className="text-xs text-gray-500">{event.address}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-sm">
                    {event.attendeeCount}/{event.capacity} attendees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Type */}
          <div>
            <h3 className="font-medium mb-2">Event Type</h3>
            <Badge variant="outline">{event.eventType}</Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            {event.url && (
              <Button variant="outline" asChild>
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Event
                </a>
              </Button>
            )}

            {event.status === "upcoming" && <Button>Register for Event</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
