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
  unreadCount?: number;
}

const messages: Message[] = [
  {
    id: "1",
    sender: "Abby Esther",
    avatar: "/avatars/02.png",
    message: "I would get back to you...",
    time: "5:28 PM",
    unreadCount: 2,
  },
  {
    id: "2",
    sender: "Abby Esther",
    avatar: "/avatars/02.png",
    message: "I would get back to you...",
    time: "5:00 PM",
  },
  {
    id: "3",
    sender: "Abby Esther",
    avatar: "/avatars/02.png",
    message: "I would get back to you...",
    time: "3:12 PM",
    unreadCount: 1,
  },
];

export function Messages({ className }: { className?: string }) {
  return (
    <Card className={`rounded-3xl shadow-lg border-none ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="md:text-2xl sm:text-xl text-lg">Messages</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-4 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-12 rounded-full text-sm bg-gray-50 border focus:ring-0"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 cursor-pointer rounded-lg transition"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={message.avatar} />
              <AvatarFallback>AE</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{message.sender}</p>
                <p className="text-xs text-muted-foreground">{message.time}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {message.message}
                </p>
                {message.unreadCount && (
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                    {message.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
