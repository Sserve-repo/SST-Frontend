import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Conversation } from "@/types/messages";

interface MessageListProps {
  conversations: Conversation[];
  selectedId?: string | null;
  onSelect: (conversation: Conversation) => void;
}

export function MessageList({
  conversations,
  selectedId,
  onSelect,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          className={`w-full p-4 text-left hover:bg-muted/50 flex items-start gap-4 border-b transition-colors ${
            selectedId === conversation.id ? "bg-muted" : ""
          }`}
        >
          <Avatar>
            <AvatarImage
              src={conversation.customer.avatar}
              alt={conversation.customer.name}
            />
            <AvatarFallback>
              {conversation.customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium">{conversation.customer.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(conversation.lastMessage.timestamp, {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {conversation.lastMessage.content}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-primary-foreground rounded-full mt-1">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
