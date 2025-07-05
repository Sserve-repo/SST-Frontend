import { baseUrl } from "../config/constant"
import Cookies from "js-cookie"

// Types for API responses
export interface LastMessagesResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        all: Array<{
            parent_message_id: number
            recipient: {
                id: number
                name: string | null
                image: string | null
            }
            sender: {
                id: number
                name: string | null
                image: string | null
            }
            last_message: string
            time_ago: string
            is_read: boolean
            is_archived: boolean
        }>
    }
    token: null
    debug: null
}

export interface FullConversationResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        participant: {
            sender: Array<{
                id: number
                name: string
                image: string | null
            }>
            recipient: Array<{
                id: number
                name: string
                image: string | null
            }>
        }
        messages: Array<{
            sender: number
            message: string
            time_ago: string
            is_read: boolean
            is_archived: boolean
        }>
    }
    token: null
    debug: null
}

export interface DeleteConversationResponse {
    status: boolean
    status_code: number
    message: string
    data: []
    token: null
    debug: null
}

export interface SendMessagePayload {
    recipient_id: string
    message: string
    attachments?: File[]
}

// Get authentication token
const getAuthToken = () => {
    const token = Cookies.get("accessToken")
    if (!token) {
        throw new Error("No authentication token found")
    }
    return token
}

// Get last messages/conversations
export const getLastMessages = async (): Promise<LastMessagesResponse> => {
    try {
        const token = getAuthToken()

        const response = await fetch(`${baseUrl}/artisan/dashboard/chat/getLastMessages`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data: LastMessagesResponse = await response.json()

        if (!data.status) {
            throw new Error(data.message || "Failed to fetch conversations")
        }

        return data
    } catch (error: any) {
        console.error("Error fetching last messages:", error)
        throw new Error(error.message || "Failed to fetch conversations")
    }
}

// Get full conversation by ID
export const getFullConversation = async (conversationId: string): Promise<FullConversationResponse> => {
    try {
        const token = getAuthToken()

        const response = await fetch(`${baseUrl}/artisan/dashboard/chat/getFullConversation/${conversationId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data: FullConversationResponse = await response.json()

        if (!data.status) {
            throw new Error(data.message || "Failed to fetch conversation")
        }

        return data
    } catch (error: any) {
        console.error("Error fetching conversation:", error)
        throw new Error(error.message || "Failed to fetch conversation")
    }
}

// Send a new message
export const sendMessage = async (payload: SendMessagePayload): Promise<any> => {
    try {
        const token = getAuthToken()

        const formData = new FormData()
        formData.append("recipient_id", payload.recipient_id)
        formData.append("message", payload.message)

        // Add attachments if any
        if (payload.attachments && payload.attachments.length > 0) {
            payload.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file)
            })
        }

        const response = await fetch(`${baseUrl}/artisan/dashboard/chat/sendMessage`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.status) {
            throw new Error(data.message || "Failed to send message")
        }

        return data
    } catch (error: any) {
        console.error("Error sending message:", error)
        throw new Error(error.message || "Failed to send message")
    }
}

// Delete a specific message
export const deleteMessage = async (messageId: string): Promise<void> => {
    try {
        const token = getAuthToken()

        const response = await fetch(`${baseUrl}/artisan/dashboard/chat/delete/${messageId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // This endpoint returns no response body according to the documentation
        return
    } catch (error: any) {
        console.error("Error deleting message:", error)
        throw new Error(error.message || "Failed to delete message")
    }
}

// Delete full conversation
export const deleteFullConversation = async (conversationId: string): Promise<DeleteConversationResponse> => {
    try {
        const token = getAuthToken()

        const response = await fetch(`${baseUrl}/artisan/dashboard/chat/deleteFullConversation/${conversationId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data: DeleteConversationResponse = await response.json()

        if (!data.status) {
            throw new Error(data.message || "Failed to delete conversation")
        }

        return data
    } catch (error: any) {
        console.error("Error deleting conversation:", error)
        throw new Error(error.message || "Failed to delete conversation")
    }
}

// Mark conversation as read (optimistic update)
export const markConversationAsRead = async (conversationId: string): Promise<void> => {
    // This is typically handled optimistically on the frontend
    // If there's a specific API endpoint for this, it can be added here
    return Promise.resolve()
}

// Archive/Unarchive conversation (optimistic update)
export const toggleConversationArchive = async (conversationId: string, isArchived: boolean): Promise<void> => {
    // This is typically handled optimistically on the frontend
    // If there's a specific API endpoint for this, it can be added here
    return Promise.resolve()
}
