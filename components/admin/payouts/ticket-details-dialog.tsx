"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketConversation } from "./ticket-conversation"
import { TicketDetails } from "./ticket-details"
import { TicketNotes } from "./ticket-notes"
import type { SupportTicket } from "@/types/support"

interface TicketDetailsDialogProps {
  ticket: SupportTicket | null
  onOpenChange: (open: boolean) => void
}

export function TicketDetailsDialog({ ticket, onOpenChange }: TicketDetailsDialogProps) {
  if (!ticket) return null

  return (
    <Dialog open={!!ticket} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Internal Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="conversation">
            <TicketConversation ticket={ticket} />
          </TabsContent>
          <TabsContent value="details">
            <TicketDetails ticket={ticket} />
          </TabsContent>
          <TabsContent value="notes">
            <TicketNotes ticket={ticket} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

