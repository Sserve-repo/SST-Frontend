import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
// import type { Event } from "@/types/events";

interface EventCardProps {
  // event: Event
  event: any;

  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={event.image || "/assets/images/image-placeholder.png"}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        <Badge
          className={cn(
            "absolute top-2 right-2",
            event.status === "upcoming" && "bg-green-500",
            event.status === "completed" && "bg-gray-500"
          )}
        >
          {event.status === "upcoming" &&
            `${event.capacity - event.registered} spots left`}
          {event.status === "ongoing" && "Ongoing"}
          {event.status === "completed" && "Completed"}
          {event.status === "cancelled" && "Cancelled"}
        </Badge>
      </div>

      <CardHeader>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
          <p className="text-sm text-gray-500">{event.shortDescription}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm">
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
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Button
          variant={event.status === "full" ? "secondary" : "default"}
          onClick={onClick}
          disabled={event.status === "completed"}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
