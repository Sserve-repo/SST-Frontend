"use client";

import { useState } from "react";
import { EventList } from "@/app/(protected)/artisan/dashboard/components/events/event-list";
import { EventDetailsDialog } from "@/app/(protected)/artisan/dashboard/components/events/event-details-dialog";
import { useToast } from "@/components/ui/toast";
import type { Event } from "@/types/events";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast(); // ✅ Now `toast` works properly

  // In a real app, this would be fetched from an API
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Advanced Hair Coloring Workshop",
      description:
        "Learn advanced techniques in hair coloring from industry experts. This workshop covers the latest trends and methods in hair coloring, including balayage, ombre, and creative color techniques.",
      shortDescription: "Master the art of advanced hair coloring techniques",
      date: new Date("2024-03-15T10:00:00"),
      duration: 180,
      location: "Style Academy, 123 Main St",
      capacity: 20,
      registered: 12,
      price: 199,
      instructor: {
        name: "Maria Rodriguez",
        title: "Master Colorist",
        image: "/placeholder.svg",
      },
      topics: [
        "Color Theory",
        "Balayage Techniques",
        "Creative Color Application",
        "Color Correction",
      ],
      status: "upcoming",
      image: "/placeholder.svg",
    },
    {
      id: "2",
      title: "Business Growth Seminar",
      description:
        "A comprehensive seminar focused on growing your beauty business. Learn about marketing, client retention, pricing strategies, and business management specifically tailored for beauty professionals.",
      shortDescription: "Essential strategies for beauty business success",
      date: new Date("2024-03-20T14:00:00"),
      duration: 120,
      location: "Virtual Event",
      capacity: 50,
      registered: 35,
      price: 99,
      instructor: {
        name: "John Smith",
        title: "Business Consultant",
        image: "/placeholder.svg",
      },
      topics: [
        "Marketing Strategies",
        "Client Retention",
        "Pricing Models",
        "Business Management",
      ],
      status: "upcoming",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      title: "Natural Hair Care Workshop",
      description:
        "Explore natural hair care techniques and products. This hands-on workshop focuses on understanding different hair textures, natural treatments, and protective styling.",
      shortDescription: "Master natural hair care and styling",
      date: new Date("2024-04-05T11:00:00"),
      duration: 240,
      location: "Beauty Hub, 456 Oak Street",
      capacity: 15,
      registered: 15,
      price: 149,
      instructor: {
        name: "Ashley Williams",
        title: "Natural Hair Specialist",
        image: "/placeholder.svg",
      },
      topics: [
        "Hair Texture Analysis",
        "Natural Treatments",
        "Protective Styling",
        "Product Selection",
      ],
      status: "full",
      image: "/placeholder.svg",
    },
  ]);

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
        <h1 className="text-2xl font-bold text-[#5D3A8B]">
          Events & Workshops
        </h1>
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
