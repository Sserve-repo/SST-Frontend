import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/events"

interface EventAttendeesProps {
  event: Event
}

export function EventAttendees({ event }: EventAttendeesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search attendees..." className="pl-8" />
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attendee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(event as any)?.attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-sm text-muted-foreground">{attendee.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      attendee.status === "confirmed" && "bg-green-100 text-green-600",
                      attendee.status === "pending" && "bg-yellow-100 text-yellow-600",
                      attendee.status === "cancelled" && "bg-red-100 text-red-600",
                      attendee.status === "attended" && "bg-blue-100 text-blue-600",
                      attendee.status === "no_show" && "bg-gray-100 text-gray-600",
                    )}
                  >
                    {attendee.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

