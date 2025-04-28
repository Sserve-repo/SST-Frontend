export interface ReviewReply {
    text: string
    date: Date
  }
  
  export interface Review {
    id: string
    customerName: string
    customerAvatar: string
    rating: number
    comment: string
    date: Date
    reply: ReviewReply | null
    status: "visible" | "hidden"
  }
  
  