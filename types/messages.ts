export interface Message {
    id: string
    sender: number
    recipient: number
    message: string
    time_ago: string
    is_read: boolean
    is_archived: boolean
    created_at: string
    updated_at: string
}

export interface Participant {
    id: number
    name: string
    image: string | null
    email?: string
    user_type?: string
}

export interface Conversation {
    id: string
    parent_message_id: number
    sender: Participant
    recipient: Participant
    customer: {
        id: number
        name: string
        avatar: string | null
    }
    lastMessage: {
        content: string
        timestamp: Date
    }
    last_message: string
    time_ago: string
    is_read: boolean
    is_archived: boolean
    status: "active" | "archived"
    unreadCount: number
    message_count?: number
}

export interface ConversationData {
    participant: {
        sender: Participant[]
        recipient: Participant[]
    }
    messages: Message[]
}

export interface SendMessageRequest {
    recipientId: string
    message: string
    parentMessageId?: string
}

export interface MessageStats {
    total: number
    unread: number
    archived: number
    today: number
}

export type MessageFilter = "all" | "unread" | "archived"

export interface MessageResponse {
    status: boolean
    status_code: number
    message: string
    data: {
        all: Conversation[]
    }
    token: null
    debug: null
}

export interface ConversationResponse {
    status: boolean
    status_code: number
    message: string
    data: ConversationData
    token: null
    debug: null
}
