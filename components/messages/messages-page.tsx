"use client";

import { useState } from "react";
import { MessageList } from "@/components/messages/message-list";
import { MessageThread } from "@/components/messages/message-thread";
import { MessageSearch } from "@/components/messages/message-search";
import { MessageFilters } from "@/components/messages/message-filters";
import { cn } from "@/lib/utils";
import type {
  Conversation,
  Message,
  MessageFilter,
  MessageAttachment,
} from "@/types/messages";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all");

  // In a real app, this would be fetched from an API
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      customer: {
        id: "c1",
        name: "Sarah Johnson",
        avatar: "/assets/images/image-placeholder.png",
        email: "sarah@example.com",
      },
      lastMessage: {
        id: "m1",
        content: "Hi, I'd like to reschedule my appointment for next week.",
        timestamp: new Date("2025-02-20T10:30:00"),
        senderId: "c1",
        read: false,
      },
      unreadCount: 1,
      status: "active",
    },
    {
      id: "2",
      customer: {
        id: "c2",
        name: "Michael Brown",
        avatar: "/assets/images/image-placeholder.png",
        email: "michael@example.com",
      },
      lastMessage: {
        id: "m2",
        content: "Thank you for the great service!",
        timestamp: new Date("2025-02-19T15:45:00"),
        senderId: "c2",
        read: true,
      },
      unreadCount: 0,
      status: "active",
    },
    {
      id: "3",
      customer: {
        id: "c3",
        name: "Emily Davis",
        avatar: "/assets/images/image-placeholder.png",
        email: "emily@example.com",
      },
      lastMessage: {
        id: "m3",
        content: "Looking forward to my appointment tomorrow!",
        timestamp: new Date("2025-02-18T09:15:00"),
        senderId: "a1",
        read: true,
      },
      unreadCount: 0,
      status: "archived",
    },
  ]);

  // In a real app, this would be fetched from an API
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1",
        content: "Hi, I'd like to reschedule my appointment for next week.",
        timestamp: new Date("2025-02-20T10:30:00"),
        senderId: "c1",
        read: false,
      },
    ],
    "2": [
      {
        id: "m2",
        content: "Thank you for the great service!",
        timestamp: new Date("2025-02-19T15:45:00"),
        senderId: "c2",
        read: true,
      },
      {
        id: "m2-reply",
        content: "You're welcome! Looking forward to seeing you again.",
        timestamp: new Date("2025-02-19T16:00:00"),
        senderId: "a1",
        read: true,
      },
    ],
    "3": [
      {
        id: "m3",
        content: "Looking forward to my appointment tomorrow!",
        timestamp: new Date("2025-02-18T09:15:00"),
        senderId: "a1",
        read: true,
      },
    ],
  });

  const handleSendMessage = (
    conversationId: string,
    content: string,
    attachments?: MessageAttachment[]
  ) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      timestamp: new Date(),
      senderId: "a1", // artisan ID
      read: true,
      attachments,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: newMessage,
            }
          : conv
      )
    );
  };

  const handleMarkAsRead = (conversationId: string) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId].map((message) => ({
        ...message,
        read: true,
      })),
    }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              lastMessage: {
                ...conv.lastMessage,
                read: true,
              },
            }
          : conv
      )
    );
  };

  const handleArchive = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              status: conv.status === "archived" ? "active" : "archived",
            }
          : conv
      )
    );
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.customer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && conversation.unreadCount > 0) ||
      (activeFilter === "archived" && conversation.status === "archived");

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="">
        <div className="flex h-[calc(100vh-65px)] ">
          <div
            className={cn(
              "w-full md:w-80 border-r flex flex-col",
              selectedConversation && "hidden md:flex"
            )}
          >
            <div className="p-4 border-b space-y-4">
              <MessageSearch value={searchQuery} onChange={setSearchQuery} />
              <MessageFilters value={activeFilter} onChange={setActiveFilter} />
            </div>
            <MessageList
              conversations={filteredConversations}
              selectedId={selectedConversation?.id}
              onSelect={setSelectedConversation}
            />
          </div>

          <div
            className={cn(
              "flex-1 w-full",
              !selectedConversation && "hidden md:block"
            )}
          >
            {selectedConversation ? (
              <MessageThread
                conversation={selectedConversation}
                messages={messages[selectedConversation.id] || []}
                onSendMessage={(content, attachments) =>
                  handleSendMessage(
                    selectedConversation.id,
                    content,
                    attachments
                  )
                }
                onBack={() => setSelectedConversation(null)}
                onMarkAsRead={() => handleMarkAsRead(selectedConversation.id)}
                onArchive={() => handleArchive(selectedConversation.id)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
