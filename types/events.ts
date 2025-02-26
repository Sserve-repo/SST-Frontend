export interface Instructor {
    name: string
    title: string
    image: string
  }
  
  export interface Event {
    id: string
    title: string
    description: string
    shortDescription: string
    date: Date
    duration: number
    location: string
    capacity: number
    registered: number
    price: number
    instructor: Instructor
    topics: string[]
    status: "upcoming" | "full" | "completed"
    image: string
  }
  
  