"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageList } from "./message-list";
import { MessageThread } from "./message-thread";
import { MessageFilters } from "./message-filters";
import { EmptyState } from "./empty-state";
import {
  useConversations,
  useConversationMessages,
} from "@/hooks/use-messages";
import { Search, MessageCircle, Users, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Conversation, MessageFilter } from "@/types/messages";

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [isMobileView, setIsMobileView] = useState(false);

  // Fetch conversations
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations();

  // Fetch selected conversation messages
  const {
    data: conversationData,
    isLoading: messagesLoading,
    // error: messagesError,
    refetch: refetchMessages,
  } = useConversationMessages(selectedConversationId);

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-refresh conversations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchConversations();
      if (selectedConversationId) {
        refetchMessages();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedConversationId, refetchConversations, refetchMessages]);

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(
    (conversation: Conversation) => {
      const matchesSearch =
        !searchTerm ||
        conversation.customer?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conversation.last_message
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !conversation.is_read) ||
        (filter === "archived" && conversation.is_archived);

      return matchesSearch && matchesFilter;
    }
  );

  // Get stats for filters
  const stats = {
    total: conversations.length,
    unread: conversations.filter((c: Conversation) => !c.is_read).length,
    archived: conversations.filter((c: Conversation) => c.is_archived).length,
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
  };

  // Handle back to conversations (mobile)
  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refetchConversations();
      if (selectedConversationId) {
        await refetchMessages();
      }
      toast.success("Messages refreshed");
    } catch (error: any) {
      toast.error("Failed to refresh messages", error);
    }
  };

  // Find selected conversation data
  const selectedConversation = conversations.find(
    (c: Conversation) => c.id === selectedConversationId
  );

  if (conversationsError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">
              Failed to load conversations. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Messages</h1>
            {/* <p className="text-gray-600 mt-1">
              Manage your conversations with customers
            </p> */}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={conversationsLoading}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 mr-2",
                  conversationsLoading && "animate-spin"
                )}
              />
              Refresh
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {stats.total} Total
            </Badge>
            {stats.unread > 0 && (
              <Badge className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {stats.unread} Unread
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div
          className={cn(
            "w-full md:w-80 border-r bg-white flex flex-col",
            isMobileView && selectedConversationId && "hidden"
          )}
        >
          {/* Search and Filters */}
          <div className="p-4 border-b space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <MessageFilters value={filter} onChange={setFilter} />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 animate-pulse"
                  >
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <EmptyState
                title={
                  searchTerm ? "No conversations found" : "No messages yet"
                }
                description={
                  searchTerm
                    ? "Try adjusting your search terms"
                    : "Your conversations will appear here when customers message you"
                }
              />
            ) : (
              <MessageList
                conversations={filteredConversations}
                selectedId={selectedConversationId}
                onSelect={handleSelectConversation}
                onDelete={() => {}}
                onArchive={() => {}}
              />
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            isMobileView && !selectedConversationId && "hidden"
          )}
        >
          {selectedConversationId && selectedConversation ? (
            <MessageThread
              conversation={selectedConversation}
              conversationData={conversationData || null}
              isLoading={messagesLoading}
              onBack={handleBackToConversations}
              onMessageSent={() => {
                // Refresh conversations and messages after sending
                refetchConversations();
                refetchMessages();
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the sidebar to start messaging"
                icon={<MessageCircle className="h-12 w-12 text-gray-400" />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
