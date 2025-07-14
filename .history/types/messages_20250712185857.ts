export interface Message {
    id: string
    sender: number
    recipient?: number
    message: string
    time_ago: string
    is_read: boolean
    is_archived: boolean
    created_at: string
    updated_at: string
}

export interface Conversation {
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
}

export interface ConversationDetails {
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
    data: ConversationDetails
    token: null
    debug: null
}

export interface MessageFilters {
    search?: string
    isRead?: boolean
    isArchived?: boolean
}

export interface MessageStats {
    total: number
    unread: number
    archived: number
}
