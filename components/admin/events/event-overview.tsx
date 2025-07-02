import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"
// import type { Event } from "@/types/events"

interface EventOverviewProps {
  event: any
}

export function EventOverview({ event }: EventOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="aspect-video overflow-hidden rounded-lg">
        <img src={event.image || "/assets/images/image-placeholder.png"} alt={event.title} className="h-full w-full object-cover" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <Badge
            variant="secondary"
            className={cn(
              event.status === "upcoming" && "bg-blue-100 text-blue-600",
              event.status === "in_progress" && "bg-yellow-100 text-yellow-600",
              event.status === "completed" && "bg-green-100 text-green-600",
              event.status === "cancelled" && "bg-red-100 text-red-600",
              event.status === "draft" && "bg-gray-100 text-gray-600",
            )}
          >
            {event.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-muted-foreground">{event.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {new Date(event.date).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className="capitalize">
            {event.location}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {event.attendees.length} / {event.capacity} attendees
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Organizer</h3>
        <div className="flex items-center gap-2">
          <img
            src={event.organizer.avatar || "/assets/images/image-placeholder.png"}
            alt={event.organizer.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium">{event.organizer.name}</p>
            <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel Event</Button>
        <Button>Send Reminder</Button>
      </div>
    </div>
  )
}

