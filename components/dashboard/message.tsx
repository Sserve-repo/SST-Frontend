"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
}

const messages: Message[] = [
  {
    id: "1",
    sender: "Abby Esther",
    avatar: "/avatars/02.png",
    message: "I would get back to you...",
    time: "10:55 AM",
  },
  {
    id: "2",
    sender: "Abby Esther",
    avatar: "/avatars/02.png",
    message: "I would get back to you...",
    time: "10:55 AM",
  },
  {
    id: "3",
    sender: "Abby Esther",
    avatar: "/avatars/02.png",
    message: "I would get back to you...",
    time: "10:55 AM",
  },
];

export function Messages({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={message.avatar} />
                <AvatarFallback>AE</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {message.sender}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {message.time}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
