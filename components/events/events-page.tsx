"use client";

import { useEffect, useState } from "react";
import { EventList } from "@/components/events/event-list";
import { EventDetailsDialog } from "@/components/events/event-details-dialog";
import type { Event } from "@/types/events";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { baseUrl } from "@/config/constant";

export const fetchEvents = async (): Promise<Event[] | null> => {
  const token = Cookies.get("accessToken");
  try {
    const res = await fetch(`${baseUrl}/artisan/dashboard/events/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch events");

    const data = await res.json();
    return data.data.events.map((event: any) => ({
      id: String(event.id),
      title: event.title,
      description: event.description,
      shortDescription: event.description.slice(0, 80) + "...",
      date: new Date(event.start_date + "T" + event.start_time),
      endDate: new Date(event.end_date + "T" + event.end_time),
      duration: 120, // Optional: calculate from start and end time
      location: event.location,
      capacity: Number(event.capacity),
      registered: 0,
      price: 0,
      instructor: {
        name: "N/A",
        title: event.event_type || "Instructor",
        image: "/assets/images/image-placeholder.png",
      },
      topics: [],
      status: event.status,
      image: event.image,
      type: event.event_type,
      organizer: {
        id: "",
        name: "Organizer",
        email: "",
        avatar: "",
      },
      attendees: [],
      createdAt: event.created_at,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};

export const fetchEventById = async (id: string): Promise<Event | null> => {
  const token = Cookies.get("accessToken");
  try {
    const res = await fetch(`${baseUrl}/artisan/dashboard/events/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch event detail");

    const event = await res.json().then((r) => r.data);
    return {
      id: String(event.id),
      title: event.title,
      description: event.description,
      shortDescription: event.description.slice(0, 80) + "...",
      date: new Date(event.start_date + "T" + event.start_time),
      endDate: new Date(event.end_date + "T" + event.end_time),
      duration: 120,
      location: event.location,
      capacity: Number(event.capacity),
      registered: 0,
      instructor: {
        name: "N/A",
        title: event.event_type || "Instructor",
        image: "/assets/images/image-placeholder.png",
      },
      topics: [],
      status: event.status,
      image: event.image,
      type: event.event_type,
      organizer: {
        id: "",
        name: "Organizer",
        email: "",
        avatar: "",
      },
      attendees: [],
      createdAt: event.created_at,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadEvents = async () => {
      const result = await fetchEvents();
      if (result) setEvents(result);
    };
    loadEvents();
  }, []);

  const handleRegister = (eventId: string) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const registered = event.registered + 1;
          const status = registered >= event.capacity ? "full" : "upcoming";
          return { ...event, registered, status };
        }
        return event;
      })
    );

    toast({
      title: "Registration successful",
      description:
        "You have been registered for the event. Check your email for details.",
    });

    setSelectedEvent(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Events & Workshops</h1>
        <p className="text-gray-500">
          Discover and register for upcoming events
        </p>
      </div>

      <EventList events={events} onEventClick={setSelectedEvent} />

      <EventDetailsDialog
        event={selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        onRegister={handleRegister}
      />
    </div>
  );
}
