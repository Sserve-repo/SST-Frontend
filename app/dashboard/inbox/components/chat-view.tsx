"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  MoreVertical,
  Printer,
  Send,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChatViewProps {
  recipientName: string;
  label: string;
  messages: ChatMessage[];
}

export function ChatView({ recipientName, label, messages }: ChatViewProps) {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 border-b p-4">
        <Link href="/" className="lg:hidden">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{recipientName}</h2>
            <Badge variant="secondary">{label}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <p>{message.content}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp}
                  </span>
                  <MoreVertical className="h-4 w-4 opacity-70" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Write message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
