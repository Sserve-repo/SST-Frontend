"use client";

import { useState } from "react";
import { EventTable } from "@/components/admin/events/event-table";
import { EventStats } from "@/components/admin/events/event-stats";
import { EventFilters } from "@/components/admin/events/event-filters";
import { CreateEventDialog } from "@/components/admin/events/create-event-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Event } from "@/types/events";

export default function EventsPage() {
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Advanced Web Development Workshop",
      description:
        "Learn the latest web development techniques and best practices.",
      type: "workshop",
      status: "upcoming",
      date: new Date("2024-03-15T14:00:00"),
      endDate: new Date("2024-03-15T17:00:00"),
      location: "virtual",
      image: "/placeholder.svg",
      capacity: 100,
      organizer: {
        id: "1",
        name: "John Smith",
        email: "john@example.com",
        avatar: "/placeholder.svg",
      },
      attendees: [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          avatar: "/placeholder.svg",
          status: "confirmed",
        },
        {
          id: "2",
          name: "Michael Brown",
          email: "michael@example.com",
          avatar: "/placeholder.svg",
          status: "pending",
        },
      ],
      createdAt: "2024-02-01T10:00:00",
      shortDescription: "",
      duration: 0,
      registered: 0,
      price: 0,
      instructor: undefined,
      topics: [],
    },
    {
      id: "2",
      title: "Digital Marketing Masterclass",
      description: "Master the art of digital marketing with industry experts.",
      type: "webinar",
      status: "in_progress",
      date: new Date("2024-02-26T15:00:00"),
      endDate: new Date("2024-02-26T16:30:00"),
      location: "virtual",
      image: "/placeholder.svg",
      capacity: 200,
      organizer: {
        id: "2",
        name: "Alice Wilson",
        email: "alice@example.com",
        avatar: "/placeholder.svg",
      },
      attendees: [
        {
          id: "3",
          name: "Emily Davis",
          email: "emily@example.com",
          avatar: "/placeholder.svg",
          status: "confirmed",
        },
      ],
      createdAt: "2024-02-10T09:00:00",
      shortDescription: "",
      duration: 0,
      registered: 0,
      price: 0,
      topics: [],
    },
    {
      id: "3",
      title: "Community Meetup",
      description:
        "Join us for our monthly community meetup and networking session.",
      type: "meetup",
      status: "completed",
      date: new Date("2024-02-20T18:00:00"),
      endDate: new Date("2024-02-20T20:00:00"),
      location: "hybrid",
      image: "/placeholder.svg",
      capacity: 50,
      organizer: {
        id: "3",
        name: "Robert Johnson",
        email: "robert@example.com",
        avatar: "/placeholder.svg",
      },
      attendees: [
        {
          id: "4",
          name: "David Lee",
          email: "david@example.com",
          avatar: "/placeholder.svg",
          status: "attended",
        },
        {
          id: "5",
          name: "Lisa Anderson",
          email: "lisa@example.com",
          avatar: "/placeholder.svg",
          status: "no_show",
        },
      ],
      createdAt: "2024-02-05T11:00:00",
      shortDescription: "",
      duration: 0,
      registered: 0,
      price: 0,
      topics: [],
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Event Management
          </h1>
          <p className="text-muted-foreground">Create and manage your events</p>
        </div>
        <CreateEventDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </CreateEventDialog>
      </div>

      <EventStats events={events} />
      <EventFilters />
      <EventTable events={events} />
    </div>
  );
}
