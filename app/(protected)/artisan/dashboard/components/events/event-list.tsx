import { EventCard } from "./event-card"
import type { Event } from "@/types/events"

interface EventListProps {
  events: Event[]
  onEventClick: (event: Event) => void
}

export function EventList({ events, onEventClick }: EventListProps) {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedEvents.map((event) => (
        <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
      ))}
    </div>
  )
}

