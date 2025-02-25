export type MessageFilter = "all" | "unread" | "archived"

export interface Customer {
    id: string
    name: string
    avatar: string
    email: string
}

export interface Message {
    id: string
    content: string
    timestamp: Date
    senderId: string
    read: boolean
    attachments?: MessageAttachment[]
}

export interface MessageAttachment {
    id: string
    type: "image" | "file"
    url: string
    name: string
    size?: number
}

export interface Conversation {
    id: string
    customer: Customer
    lastMessage: Message
    unreadCount: number
    status: "active" | "archived"
}

