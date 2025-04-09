import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Clock, CheckCircle } from "lucide-react"
import type { Event } from "@/types/events/events"

interface EventStatsProps {
  events: Event[]
}

const stats = [
  {
    title: "Total Events",
    value: (events: Event[]) => events.length,
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Upcoming Events",
    value: (events: Event[]) => events.filter((event) => event.status === "upcoming").length,
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Total Attendees",
    value: (events: Event[]) => events.reduce((acc, event) => acc + event.attendees.length, 0),
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Completed Events",
    value: (events: Event[]) => events.filter((event) => event.status === "completed").length,
    icon: CheckCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
]

export function EventStats({ events }: EventStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value(events)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

