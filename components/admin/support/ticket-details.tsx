"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { SupportTicket } from "@/types/support"

interface TicketDetailsProps {
  ticket: SupportTicket
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{ticket.subject}</h2>
          <Badge
            variant="secondary"
            className={cn(
              ticket.status === "open" && "bg-blue-100 text-blue-600",
              ticket.status === "in_progress" && "bg-yellow-100 text-yellow-600",
              ticket.status === "resolved" && "bg-green-100 text-green-600",
              ticket.status === "closed" && "bg-gray-100 text-gray-600",
            )}
          >
            {ticket.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{ticket.description}</p>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select defaultValue={ticket.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select defaultValue={ticket.priority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Assign To</label>
          <Select defaultValue={ticket.assignedTo?.id}>
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">John Admin</SelectItem>
              <SelectItem value="2">Alice Admin</SelectItem>
              <SelectItem value="3">Bob Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Ticket Information</h3>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <Badge variant="secondary" className="capitalize">
              {ticket.type.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Update Ticket</Button>
      </div>
    </div>
  )
}

