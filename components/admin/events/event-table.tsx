"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventDetailsDialog } from "./event-details-dialog";
import { EditEventDialog } from "./edit-event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/events";

interface EventTableProps {
  // events: Event[];
  events: any;
}

export function EventTable({ events }: EventTableProps) {
  const [eventToView, setEventToView] = useState<Event | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        event.image || "/assets/images/image-placeholder.png"
                      }
                      alt={event.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {event.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleTimeString()} -{" "}
                      {new Date(event.endDate).toLocaleTimeString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      event.location === "virtual" &&
                        "bg-blue-100 text-blue-600",
                      event.location === "in_person" &&
                        "bg-green-100 text-green-600",
                      event.location === "hybrid" &&
                        "bg-purple-100 text-purple-600"
                    )}
                  >
                    {event.location}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={event.organizer.avatar}
                        alt={event.organizer.name}
                      />
                      <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{event.organizer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      event.status === "upcoming" &&
                        "bg-blue-100 text-blue-600",
                      event.status === "in_progress" &&
                        "bg-yellow-100 text-yellow-600",
                      event.status === "completed" &&
                        "bg-green-100 text-green-600",
                      event.status === "cancelled" && "bg-red-100 text-red-600",
                      event.status === "draft" && "bg-gray-100 text-gray-600"
                    )}
                  >
                    {event.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setEventToView(event)}
                  >
                    <Users className="h-4 w-4" />
                    <span>{event.attendees.length}</span>
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEventToView(event)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEventToEdit(event)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setEventToDelete(event)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EventDetailsDialog
        event={eventToView}
        onOpenChange={(open) => !open && setEventToView(null)}
      />
      <EditEventDialog
        eventId={eventToEdit?.id as string}
        event={eventToEdit}
        onOpenChange={(open) => !open && setEventToEdit(null)}
      />
      <DeleteEventDialog
        eventId={eventToDelete?.id as string}
        eventTitle={eventToDelete?.title as string}
        event={eventToDelete}
        onOpenChange={(open) => !open && setEventToDelete(null)}
      />
    </>
  );
}
