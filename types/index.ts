export interface Message {
    id: string
    sender: string
    subject: string
    label: 'Artisan' | 'Vendor'
    timestamp: string
    starred: boolean
    content: string
}

export interface ChatMessage {
    id: string
    content: string
    timestamp: string
    sender: 'user' | 'other'
}

