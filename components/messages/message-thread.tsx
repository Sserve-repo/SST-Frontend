"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, Send, MoreVertical, Paperclip, Smile } from "lucide-react";
import { useSendMessage } from "@/hooks/use-messages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { ConversationData, Message } from "@/types/messages";

interface MessageThreadProps {
  conversation: any;
  conversationData: ConversationData | null;
  isLoading: boolean;
  onBack: () => void;
  onMessageSent?: () => void;
}

export function MessageThread({
  conversation,
  conversationData,
  isLoading,
  onBack,
  onMessageSent,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  const sendMessage = useSendMessage();

  // Get participant info (the other person in conversation)
  const getOtherParticipant = () => {
    if (!conversationData?.participant) {
      return {
        name:
          conversation.recipient?.name ||
          conversation.sender?.name ||
          "Unknown User",
        image: conversation.recipient?.image || conversation.sender?.image,
        id: conversation.recipient?.id || conversation.sender?.id,
      };
    }

    const currentUserId = currentUser?.id;
    const allParticipants = [
      ...conversationData.participant.sender,
      ...conversationData.participant.recipient,
    ];

    const otherParticipant = allParticipants.find(
      (p) => p.id !== currentUserId
    );
    return otherParticipant || allParticipants[0];
  };

  const otherParticipant = getOtherParticipant();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationData?.messages]);

  // Focus input when thread loads
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherParticipant?.id) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsTyping(true);

    try {
      await sendMessage.mutateAsync({
        recipientId: otherParticipant.id.toString(),
        message: messageText,
        parentMessageId: conversation.parent_message_id?.toString(),
      });

      // Call the callback to refresh conversations
      onMessageSent?.();
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      // Restore the message if sending failed
      setNewMessage(messageText);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const isMyMessage = (senderId: number) => {
    return senderId === currentUser?.id;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={otherParticipant?.image || undefined} />
          <AvatarFallback className="bg-blue-100 text-primary-600">
            {otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">
            {otherParticipant?.name || "Unknown User"}
          </h2>
          <p className="text-sm text-gray-500">
            {conversationData?.messages?.length || 0} messages
            {isTyping && " • typing..."}
          </p>
        </div>

        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : !conversationData?.messages ||
          conversationData.messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-lg font-medium mb-2">
                Start the conversation!
              </p>
              <p className="text-sm">
                Send a message to {otherParticipant?.name} to begin chatting.
              </p>
            </div>
          </div>
        ) : (
          conversationData.messages.map((message: Message, index: number) => {
            const isMine = isMyMessage(message.sender);

            return (
              <div
                key={index}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  isMine ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {!isMine && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={otherParticipant?.image || undefined} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-full shadow-sm",
                    isMine
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.message}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      isMine ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {formatTime(message.time_ago)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${otherParticipant?.name || "user"}...`}
              className="pr-20"
              disabled={sendMessage.isPending}
              maxLength={1000}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                disabled={sendMessage.isPending}
              >
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                disabled={sendMessage.isPending}
              >
                <Smile className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendMessage.isPending}
            className="px-4"
          >
            {sendMessage.isPending ? (
              <LoadingSpinner className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
