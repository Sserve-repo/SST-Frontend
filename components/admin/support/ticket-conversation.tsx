"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import type { SupportTicket } from "@/types/support"

interface TicketConversationProps {
  ticket: SupportTicket
}

export function TicketConversation({ ticket }: TicketConversationProps) {
  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === "admin" ? "flex-row" : "flex-row-reverse"}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={message.sender === "admin" ? ticket.assignedTo?.avatar : ticket.user.avatar}
                alt={message.sender === "admin" ? ticket.assignedTo?.name || "Admin" : ticket.user.name}
              />
              <AvatarFallback>
                {message.sender === "admin" ? ticket.assignedTo?.name[0] || "A" : ticket.user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{new Date(message.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <form className="flex gap-2">
          <Textarea placeholder="Type your message..." className="min-h-[80px]" />
          <Button type="submit" size="icon" className="h-[80px] w-[80px]">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

