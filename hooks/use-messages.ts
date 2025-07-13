"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getLastMessages,
    getFullConversation,
    sendMessage,
    deleteFullConversation,
    deleteMessage,
    markMessageAsRead,
    archiveConversation,
} from "@/actions/messages-api"
import type {
    Conversation,
    ConversationData,
    SendMessageRequest,
    MessageResponse,
    ConversationResponse,
} from "@/types/messages"
import { toast } from "sonner"

// Transform raw conversation data to match our types
const transformConversation = (rawConversation: any): Conversation => ({
    id: rawConversation.parent_message_id.toString(),
    parent_message_id: rawConversation.parent_message_id,
    sender: rawConversation.sender,
    recipient: rawConversation.recipient,
    customer: {
        id: rawConversation.recipient?.id || rawConversation.sender?.id,
        name: rawConversation.recipient?.name || rawConversation.sender?.name || "Unknown User",
        avatar: rawConversation.recipient?.image || rawConversation.sender?.image,
    },
    lastMessage: {
        content: rawConversation.last_message || "No messages yet",
        timestamp: new Date(rawConversation.time_ago),
    },
    last_message: rawConversation.last_message,
    time_ago: rawConversation.time_ago,
    is_read: rawConversation.is_read,
    is_archived: rawConversation.is_archived,
    status: rawConversation.is_archived ? "archived" : "active",
    unreadCount: rawConversation.is_read ? 0 : 1,
    message_count: rawConversation.message_count || 0,
})

export function useConversations() {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: async (): Promise<Conversation[]> => {
            const response = await getLastMessages()
            if (!response?.ok) {
                throw new Error("Failed to fetch conversations")
            }

            const data: MessageResponse = await response.json()
            if (!data.status || !data.data?.all) {
                throw new Error(data.message || "Failed to fetch conversations")
            }
            console.log("Fetched conversations:", data)
            return data.data.all.map(transformConversation)
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
    })
}

export function useConversationMessages(conversationId: string | null) {
    return useQuery({
        queryKey: ["conversation-messages", conversationId],
        queryFn: async (): Promise<ConversationData> => {
            if (!conversationId) {
                return {
                    participant: { sender: [], recipient: [] },
                    messages: [],
                }
            }
            console.log(`Fetching messages for conversation ID: ${conversationId}`)
            console.log("Using conversation ID:", conversationId)
            const response = await getFullConversation(conversationId)
            if (!response?.ok) {
                throw new Error("Failed to fetch conversation messages")
            }

            const data: ConversationResponse = await response.json()
            if (!data.status || !data.data) {
                throw new Error(data.message || "Failed to fetch conversation messages")
            }
            console.log("Fetched conversation messages:", data)
            return data.data
        },
        enabled: !!conversationId,
        refetchInterval: 10000, // Refetch every 10 seconds when active
    })
}

export function useSendMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ recipientId, message, parentMessageId }: SendMessageRequest) => {
            const response = await sendMessage(recipientId, message, parentMessageId)
            if (!response?.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to send message")
            }
            return response.json()
        },
        onSuccess: () => {
            // Invalidate and refetch conversations and messages
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            queryClient.invalidateQueries({ queryKey: ["conversation-messages"] })
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to send message")
        },
    })
}

export function useDeleteConversation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (conversationId: string) => {
            const response = await deleteFullConversation(conversationId)
            if (!response?.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to delete conversation")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            toast.success("Conversation deleted successfully")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete conversation")
        },
    })
}

export function useDeleteMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (messageId: string) => {
            const response = await deleteMessage(messageId)
            if (!response?.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to delete message")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            queryClient.invalidateQueries({ queryKey: ["conversation-messages"] })
            toast.success("Message deleted successfully")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete message")
        },
    })
}

export function useArchiveConversation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ conversationId, isArchived }: { conversationId: string; isArchived: boolean }) => {
            const response = await archiveConversation(conversationId, isArchived)
            if (!response?.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to archive conversation")
            }
            return response.json()
        },
        onSuccess: (_, { isArchived }) => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            toast.success(`Conversation ${isArchived ? "archived" : "unarchived"} successfully`)
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to archive conversation")
        },
    })
}

export function useMarkAsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (messageId: string) => {
            const response = await markMessageAsRead(messageId)
            if (!response?.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to mark message as read")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            queryClient.invalidateQueries({ queryKey: ["conversation-messages"] })
        },
    })
}
