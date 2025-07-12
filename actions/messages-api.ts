import { baseUrl } from "../config/constant"
import Cookies from "js-cookie"

// Get last messages/conversations
export const getLastMessages = async () => {
    const token = Cookies.get("accessToken")
    try {
        const response = await fetch(`${baseUrl}/dashboard/chat/getLastMessages`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        return response
    } catch (error: any) {
        console.log("Error fetching last messages", error)
        throw error
    }
}

// Get full conversation by parent message ID
export const getFullConversation = async (parentMessageId: string) => {
    const token = Cookies.get("accessToken")
    try {
        const response = await fetch(`${baseUrl}/dashboard/chat/getFullConversation/${parentMessageId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        return response
    } catch (error: any) {
        console.log("Error fetching full conversation", error)
        throw error
    }
}

// Send a new message
export const sendMessage = async (recipientId: string, message: string, parentMessageId?: string) => {
    const token = Cookies.get("accessToken")
    try {
        const formData = new FormData()
        formData.append("recipient_id", recipientId)
        formData.append("message", message)
        if (parentMessageId) {
            formData.append("parent_message_id", parentMessageId)
        }

        const response = await fetch(`${baseUrl}/dashboard/chat/send`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        return response
    } catch (error: any) {
        console.log("Error sending message", error)
        throw error
    }
}

// Delete a specific message
export const deleteMessage = async (messageId: string) => {
    const token = Cookies.get("accessToken")
    try {
        const response = await fetch(`${baseUrl}/dashboard/chat/delete/${messageId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        return response
    } catch (error: any) {
        console.log("Error deleting message", error)
        throw error
    }
}

// Delete full conversation
export const deleteFullConversation = async (parentMessageId: string) => {
    const token = Cookies.get("accessToken")
    try {
        const response = await fetch(`${baseUrl}/dashboard/chat/deleteFullConversation/${parentMessageId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        return response
    } catch (error: any) {
        console.log("Error deleting full conversation", error)
        throw error
    }
}

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
    const token = Cookies.get("accessToken")
    try {
        const response = await fetch(`${baseUrl}/dashboard/chat/markAsRead/${messageId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        return response
    } catch (error: any) {
        console.log("Error marking message as read", error)
        throw error
    }
}

// Archive/unarchive conversation
export const archiveConversation = async (parentMessageId: string, isArchived: boolean) => {
    const token = Cookies.get("accessToken")
    try {
        const formData = new FormData()
        formData.append("is_archived", isArchived.toString())

        const response = await fetch(`${baseUrl}/dashboard/chat/archive/${parentMessageId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        return response
    } catch (error: any) {
        console.log("Error archiving conversation", error)
        throw error
    }
}
