export interface Message {
    id: string
    sender: string
    subject: string
    label: string
    timestamp: string
    starred: boolean
    content: string
}

export interface ChatMessage {
    id: string
    content: string
    timestamp: string
    sender: string
}

