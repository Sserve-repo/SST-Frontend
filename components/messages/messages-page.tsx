"use client";

import { useState } from "react";
import { MessageList } from "@/components/messages/message-list";
import { MessageThread } from "@/components/messages/message-thread";
import { MessageSearch } from "@/components/messages/message-search";
import { MessageFilters } from "@/components/messages/message-filters";
import { EmptyState } from "@/components/messages/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import type { Conversation, MessageFilter } from "@/types/messages";
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useDeleteMessage,
  useDeleteConversation,
  useMarkAsRead,
  useToggleArchive,
} from "@/hooks/use-messages";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all");
  const { currentUser } = useAuth();

  // Queries
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations();

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
  } = useConversationMessages(selectedConversation?.id || null);

  // Mutations
  const sendMessageMutation = useSendMessage();
  const deleteMessageMutation = useDeleteMessage();
  const deleteConversationMutation = useDeleteConversation();
  const markAsReadMutation = useMarkAsRead();
  const toggleArchiveMutation = useToggleArchive();

  // Handlers
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (conversation.unreadCount > 0) {
      markAsReadMutation.mutate(conversation.id);
    }
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversation.id,
        recipient_id: selectedConversation.customer.id,
        message: content.trim(),
        attachments,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageMutation.mutateAsync(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversationMutation.mutateAsync(conversationId);
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const isCurrentlyArchived = conversation.status === "archived";

    try {
      await toggleArchiveMutation.mutateAsync({
        conversationId,
        isArchived: !isCurrentlyArchived,
      });

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error("Failed to archive conversation:", error);
    }
  };

  // Filter conversations
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

  // Error state
  if (conversationsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load conversations. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetchConversations()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Loading state
  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Conversations Sidebar */}
      <div
        className={cn(
          "w-full md:w-80 border-r flex flex-col bg-background",
          selectedConversation && "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="text-sm text-muted-foreground">
              {filteredConversations.length} conversations
            </div>
          </div>
          <MessageSearch value={searchQuery} onChange={setSearchQuery} />
          <MessageFilters value={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-hidden">
          {filteredConversations.length === 0 ? (
            <EmptyState
              title="No conversations found"
              description={
                searchQuery
                  ? "Try adjusting your search terms"
                  : "Start a conversation to see it here"
              }
            />
          ) : (
            <MessageList
              conversations={filteredConversations}
              selectedId={selectedConversation?.id}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteConversation}
              onArchive={handleArchiveConversation}
              isDeleting={deleteConversationMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-background",
          !selectedConversation && "hidden md:flex"
        )}
      >
        {selectedConversation ? (
          <>
            {messagesError ? (
              <div className="flex-1 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load messages. Please try again.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <MessageThread
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onBack={() => setSelectedConversation(null)}
                onArchive={() =>
                  handleArchiveConversation(selectedConversation.id)
                }
                isLoading={messagesLoading}
                isSending={sendMessageMutation.isPending}
                isDeleting={deleteMessageMutation.isPending}
                currentUserId={currentUser?.id}
              />
            )}
          </>
        ) : (
          <EmptyState
            title="Select a conversation"
            description="Choose a conversation from the sidebar to start messaging"
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
}
