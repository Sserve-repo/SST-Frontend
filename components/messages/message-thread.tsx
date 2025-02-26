"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  ArrowLeft,
  Image,
  MoreVertical,
  Paperclip,
  Send,
} from "lucide-react";
import type {
  Conversation,
  Message,
  MessageAttachment,
} from "@/types/messages";

interface MessageThreadProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, attachments?: MessageAttachment[]) => void;
  onBack: () => void;
  onMarkAsRead: () => void;
  onArchive: () => void;
}

export function MessageThread({
  conversation,
  messages,
  onSendMessage,
  onBack,
  onMarkAsRead,
  onArchive,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (conversation.unreadCount > 0) {
      onMarkAsRead();
    }
  }, [conversation.unreadCount, onMarkAsRead, scrollToBottom]);

  const handleSend = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage.trim(), attachments);
      setNewMessage("");
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: MessageAttachment[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith("image/") ? "image" : "file",
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarImage
            src={conversation.customer.avatar}
            alt={conversation.customer.name}
          />
          <AvatarFallback>
            {conversation.customer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{conversation.customer.name}</h2>
          <p className="text-sm text-muted-foreground">
            {conversation.customer.email}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              {conversation.status === "archived" ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.senderId === "a1" ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  message.senderId === "a1"
                    ? "/assets/images/image-placeholder.png"
                    : conversation.customer.avatar
                }
                alt={
                  message.senderId === "a1" ? "You" : conversation.customer.name
                }
              />
              <AvatarFallback>
                {message.senderId === "a1"
                  ? "Y"
                  : conversation.customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`rounded-lg p-4 max-w-[70%] space-y-2 ${
                message.senderId === "a1"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.attachments?.map((attachment) => (
                <div key={attachment.id} className="rounded-md overflow-hidden">
                  {attachment.type === "image" ? (
                    <img
                      src={attachment.url || "/assets/images/image-placeholder.png"}
                      alt={attachment.name}
                      className="max-w-full h-auto"
                    />
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-background/50 rounded"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">{attachment.name}</span>
                    </a>
                  )}
                </div>
              ))}
              {message.content && <p className="text-sm">{message.content}</p>}
              <span
                className={`text-xs ${
                  message.senderId === "a1"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 space-y-4">
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative group rounded-md overflow-hidden"
              >
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url || "/assets/images/image-placeholder.png"}
                    alt={attachment.name}
                    className="h-20 w-20 object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 flex items-center justify-center bg-muted">
                    <Paperclip className="h-6 w-6" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setAttachments((prev) =>
                      prev.filter((a) => a.id !== attachment.id)
                    )
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 min-h-[2.5rem] max-h-32"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() && attachments.length === 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
