import { Message } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MessagesListProps {
  messages: Message[];
}

export function MessagesList({ messages }: MessagesListProps) {
  return (
    <div className="divide-y">
      {messages.map((message) => (
        <Link
          key={message.id}
          href={`/inbox/${message.id}`}
          className="flex items-center gap-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Checkbox />
          <button className="text-gray-500 hover:text-yellow-500">
            <Star
              className={cn(
                "h-5 w-5",
                message.starred && "fill-yellow-400 text-yellow-400"
              )}
            />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{message.sender}</span>
              <Badge
                variant={message.label === "Artisan" ? "secondary" : "outline"}
              >
                {message.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {message.subject}
            </p>
          </div>
          <span className="text-sm text-gray-500">{message.timestamp}</span>
        </Link>
      ))}
    </div>
  );
}
