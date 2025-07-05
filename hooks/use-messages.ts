import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getLastMessages,
    getFullConversation,
    sendMessage,
    deleteMessage,
    deleteFullConversation,
    type SendMessagePayload,
} from "@/actions/messages-api"
import { toast } from "sonner"
import type { Conversation, Message } from "@/types/messages"

// Query keys
export const messageKeys = {
    all: ["messages"] as const,
    conversations: () => [...messageKeys.all, "conversations"] as const,
    conversation: (id: string) => [...messageKeys.all, "conversation", id] as const,
}

// Transform API data to our types
const transformConversations = (apiData: any[]): Conversation[] => {
    return apiData.map((conversation) => ({
        id: conversation.parent_message_id?.toString() || Math.random().toString(36).substr(2, 9),
        customer: {
            id: conversation.recipient?.id?.toString() || "",
            name: conversation.recipient?.name || "Unknown User",
            avatar: conversation.recipient?.image || "/placeholder.svg?height=40&width=40",
            email: conversation.recipient?.email || conversation.recipient?.name || "No email",
        },
        lastMessage: {
            id: "last",
            content: conversation.last_message || "",
            timestamp: new Date(conversation.time_ago || Date.now()),
            senderId: conversation.sender?.id?.toString() || "",
            read: conversation.is_read || false,
        },
        unreadCount: conversation.is_read ? 0 : 1,
        status: conversation.is_archived ? "archived" : "active",
    }))
}

const transformMessages = (apiData: any[]): Message[] => {
    return apiData.map((msg, index) => ({
        id: `msg-${index}-${Date.now()}`,
        content: msg.message || "",
        timestamp: new Date(msg.time_ago || Date.now()),
        senderId: msg.sender?.toString() || "",
        read: msg.is_read || false,
        attachments: msg.attachments || [],
    }))
}

// Hook to fetch conversations
export function useConversations() {
    return useQuery({
        queryKey: messageKeys.conversations(),
        queryFn: async () => {
            const response = await getLastMessages()
            return transformConversations(response.data.all)
        },
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // Refetch every minute
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

// Hook to fetch conversation messages
export function useConversationMessages(conversationId: string | null) {
    return useQuery({
        queryKey: messageKeys.conversation(conversationId || ""),
        queryFn: async () => {
            if (!conversationId) return []
            const response = await getFullConversation(conversationId)
            return transformMessages(response.data.messages)
        },
        enabled: !!conversationId,
        staleTime: 10000, // 10 seconds
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

// Hook to send message
export function useSendMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: SendMessagePayload & { conversationId: string }) => {
            const { conversationId, ...messagePayload } = payload
            return await sendMessage(messagePayload)
        },
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: messageKeys.conversation(variables.conversationId) })
            await queryClient.cancelQueries({ queryKey: messageKeys.conversations() })

            // Snapshot previous values
            const previousMessages = queryClient.getQueryData(messageKeys.conversation(variables.conversationId))
            const previousConversations = queryClient.getQueryData(messageKeys.conversations())

            // Optimistically update messages
            const optimisticMessage: Message = {
                id: `temp-${Date.now()}`,
                content: variables.message,
                timestamp: new Date(),
                senderId: "current-user", // This should be the current user's ID
                read: true,
                attachments: [],
            }

            queryClient.setQueryData(messageKeys.conversation(variables.conversationId), (old: Message[] | undefined) => [
                ...(old || []),
                optimisticMessage,
            ])

            // Update conversations list
            queryClient.setQueryData(messageKeys.conversations(), (old: Conversation[] | undefined) => {
                if (!old) return []
                return old.map((conv) =>
                    conv.id === variables.conversationId
                        ? {
                            ...conv,
                            lastMessage: optimisticMessage,
                            unreadCount: 0,
                        }
                        : conv,
                )
            })

            return { previousMessages, previousConversations }
        },
        onError: (error, variables, context) => {
            // Revert optimistic updates
            if (context?.previousMessages) {
                queryClient.setQueryData(messageKeys.conversation(variables.conversationId), context.previousMessages)
            }
            if (context?.previousConversations) {
                queryClient.setQueryData(messageKeys.conversations(), context.previousConversations)
            }
            toast.error(error.message || "Failed to send message")
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch to get the real data
            queryClient.invalidateQueries({ queryKey: messageKeys.conversation(variables.conversationId) })
            queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
            toast.success("Message sent successfully")
        },
    })
}

// Hook to delete message
export function useDeleteMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messageKeys.all })
            toast.success("Message deleted successfully")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete message")
        },
    })
}

// Hook to delete conversation
export function useDeleteConversation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteFullConversation,
        onMutate: async (conversationId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: messageKeys.conversations() })

            // Snapshot previous value
            const previousConversations = queryClient.getQueryData(messageKeys.conversations())

            // Optimistically remove conversation
            queryClient.setQueryData(messageKeys.conversations(), (old: Conversation[] | undefined) => {
                if (!old) return []
                return old.filter((conv) => conv.id !== conversationId)
            })

            return { previousConversations }
        },
        onError: (error, conversationId, context) => {
            // Revert optimistic update
            if (context?.previousConversations) {
                queryClient.setQueryData(messageKeys.conversations(), context.previousConversations)
            }
            toast.error(error.message || "Failed to delete conversation")
        },
        onSuccess: () => {
            toast.success("Conversation deleted successfully")
        },
    })
}

// Hook to mark conversation as read
export function useMarkAsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (conversationId: string) => {
            // Optimistic update
            queryClient.setQueryData(messageKeys.conversations(), (old: Conversation[] | undefined) => {
                if (!old) return []
                return old.map((conv) =>
                    conv.id === conversationId
                        ? {
                            ...conv,
                            unreadCount: 0,
                            lastMessage: { ...conv.lastMessage, read: true },
                        }
                        : conv,
                )
            })

            // Update messages as read
            queryClient.setQueryData(messageKeys.conversation(conversationId), (old: Message[] | undefined) => {
                if (!old) return []
                return old.map((msg) => ({ ...msg, read: true }))
            })
        },
        onError: (error, conversationId) => {
            // Revert on error
            queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
            queryClient.invalidateQueries({ queryKey: messageKeys.conversation(conversationId) })
            toast.error("Failed to mark as read")
        },
    })
}

// Hook to toggle archive status
export function useToggleArchive() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ conversationId, isArchived }: { conversationId: string; isArchived: boolean }) => {
            // Optimistic update
            queryClient.setQueryData(messageKeys.conversations(), (old: Conversation[] | undefined) => {
                if (!old) return []
                return old.map((conv) =>
                    conv.id === conversationId
                        ? {
                            ...conv,
                            status: isArchived ? "archived" : "active",
                        }
                        : conv,
                )
            })
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
            toast.error("Failed to update conversation")
        },
        onSuccess: (_, { isArchived }) => {
            toast.success(isArchived ? "Conversation archived" : "Conversation unarchived")
        },
    })
}
