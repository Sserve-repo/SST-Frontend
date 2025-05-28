"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import type { SupportTicket } from "@/types/support"

interface TicketNotesProps {
  ticket: SupportTicket
}

export function TicketNotes({ ticket }: TicketNotesProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {ticket.internalNotes.map((note) => (
          <div key={note.id} className="flex gap-4 rounded-lg border p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt={note.author} />
              <AvatarFallback>{note.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{note.author}</p>
                <span className="text-xs text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm">{note.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea placeholder="Add an internal note..." className="min-h-[100px]" />
        <div className="flex justify-end">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>
    </div>
  )
}

