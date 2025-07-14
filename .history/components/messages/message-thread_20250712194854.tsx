"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Archive,
  Trash2,
  Paperclip,
  ArchiveRestore,
} from "lucide-react";
import type { Conversation, Message } from "@/types/messages";

interface MessageThreadProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  onDeleteMessage: (messageId: string) => void;
  onBack: () => void;
  onArchive: () => void;
  isLoading?: boolean;
  isSending?: boolean;
  isDeleting?: boolean;
  currentUserId?: string;
}

export function MessageThread({
  conversation,
  messages,
  onSendMessage,
  onDeleteMessage,
  onBack,
  onArchive,
  isLoading = false,
  isSending = false,
  isDeleting = false,
  currentUserId,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    onSendMessage(newMessage, attachments);
    setNewMessage("");
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const isArchived = conversation.status === "archived";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage
            src={conversation.customer.avatar || "/placeholder.svg"}
            alt={conversation.customer.name}
          />
          <AvatarFallback>
            {conversation.customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm truncate">
            {conversation.customer.name}
          </h2>
          <p className="text-xs text-muted-foreground truncate">
            {conversation.customer.email}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onArchive}>
              {isArchived ? (
                <>
                  <ArchiveRestore className="h-4 w-4 mr-2" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-2">
              <div className="text-muted-foreground">No messages yet</div>
              <div className="text-sm text-muted-foreground">
                Start the conversation below
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showDate =
                index === 0 ||
                format(message.timestamp, "yyyy-MM-dd") !==
                  format(messages[index - 1].timestamp, "yyyy-MM-dd");

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <Separator className="flex-1" />
                      <span className="px-3 text-xs text-muted-foreground bg-background">
                        {format(message.timestamp, "MMMM d, yyyy")}
                      </span>
                      <Separator className="flex-1" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex gap-3 group",
                      isCurrentUser && "flex-row-reverse"
                    )}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage
                        src={
                          isCurrentUser
                            ? "/placeholder.svg?height=32&width=32"
                            : conversation.customer.avatar
                        }
                        alt={isCurrentUser ? "You" : conversation.customer.name}
                      />
                      <AvatarFallback className="text-xs">
                        {isCurrentUser
                          ? "Y"
                          : conversation.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={cn(
                        "flex flex-col space-y-1 max-w-[70%]",
                        isCurrentUser && "items-end"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs text-muted-foreground",
                          isCurrentUser && "flex-row-reverse"
                        )}
                      >
                        <span>
                          {formatDistanceToNow(message.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                        {!message.read && !isCurrentUser && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                        {isCurrentUser && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onDeleteMessage(message.id)}
                                className="text-destructive focus:text-destructive"
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-muted rounded-md px-2 py-1 text-sm"
              >
                <Paperclip className="h-3 w-3" />
                <span className="truncate max-w-32">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => removeAttachment(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isSending}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={
              (!newMessage.trim() && attachments.length === 0) || isSending
            }
            size="sm"
          >
            {isSending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
