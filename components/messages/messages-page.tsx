"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  createMessage,
  fetchConversations,
  fetchLastConversations,
} from "@/actions/dashboard/vendors";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all");
  const [loading, setLoading] = useState(true);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const handleFetchLastConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchLastConversations();

      if (!response?.ok) {
        const errorData = await response?.json();
        throw new Error(errorData?.message || "Failed to fetch conversations");
      }

      const waitedResponse = await response.json();
      const data = waitedResponse.data?.all || [];

      const transformedConversations = data.map((conversation: any) => ({
        id:
          conversation?.parent_message_id ||
          Math.random().toString(36).substr(2, 9),
        customer: {
          id: conversation?.recipient?.id || "",
          name: conversation?.recipient?.name || "Unknown User",
          avatar: conversation?.recipient?.image_url || "/placeholder.svg",
          email:
            conversation?.recipient?.email ||
            conversation?.recipient?.name ||
            "No email",
        },
        lastMessage: {
          id: "m1",
          content: conversation?.last_message || "",
          timestamp: new Date(conversation.time_ago || Date.now()),
          senderId: conversation?.sender?.id || "",
          read: false,
        },
        unreadCount: 1,
        status: "active" as const,
      }));

      setConversations(transformedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetchConversations = useCallback(async () => {
    if (!selectedConversation?.id) return;

    try {
      const response = await fetchConversations(selectedConversation?.id);

      if (!response?.ok) {
        const errorData = await response?.json();
        console.error("Failed to fetch conversations:", errorData);
        throw new Error("Fetching conversations failed");
      }

      const waitedResponse = await response.json();
      const data = waitedResponse.data;
      console.log({ data });

      // Only update if we have data and it's an array
      if (data && Array.isArray(data.messages)) {
        setMessages((prev) => {
          // Check if we already have this conversation's messages
          // const existingMessages = prev[selectedConversation.id] || [];

          // Only update if we have new data
          if (data.messages.length > 0) {
            return {
              ...prev,
              [selectedConversation.id]: data.messages.map((msg) => ({
                id: msg.id || Math.random().toString(36).substr(2, 9),
                content: msg.message || "",
                timestamp: new Date(msg.time_ago || Date.now()),
                senderId: msg.sender || "",
                read: !!msg.is_read,
                attachments: msg.attachments,
              })),
            };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [selectedConversation?.id]);

  const handleSendMessage = async (
    conversationId: string,
    recipientId: string,
    content: string,
    attachments?: MessageAttachment[]
  ) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      timestamp: new Date(),
      senderId: currentUser?.id, // artisan ID
      read: true,
      attachments,
    };

    console.log({ conversationId, recipientId });

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

    try {
      const form = new FormData();
      form.append("recipient_id", recipientId.toString());
      form.append("message", content);

      const response = await createMessage(form);
      const data = await response?.json();
      if (data?.status !== true) {
        toast.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      // toast.error("Failed to submit reply");
    }
  };

  const handleMarkAsRead = (conversationId: string) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map((message) => ({
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

  useEffect(() => {
    handleFetchLastConversations();
  }, [handleFetchLastConversations]); // This runs only once on component mount

  // Using a ref to track if we've already fetched for this conversation
  const fetchedConversationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (
      selectedConversation?.id &&
      !fetchedConversationsRef.current.has(selectedConversation.id)
    ) {
      console.log(
        "Fetching conversation details for:",
        selectedConversation.id
      );
      fetchedConversationsRef.current.add(selectedConversation.id);
      handleFetchConversations();
    }
  }, [selectedConversation?.id, handleFetchConversations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                    selectedConversation.customer.id,
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
