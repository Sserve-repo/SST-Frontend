export interface Event {
  id: string
  title: string
  description: string
  image: string
  eventType: "Workshop" | "Webinar" | "Conference" | "Meetup" | "Other"
  location: string
  address: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  capacity: number
  url?: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  attendeeCount: number
  createdAt: Date
  updatedAt: Date
}

export interface EventFormData {
  title: string
  description: string
  image?: File
  event_type: string
  location: string
  address: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  capacity: number
  url?: string
}

export interface EventFilters {
  status?: string
  eventType?: string
  search?: string
  dateRange?: {
    from: Date
    to: Date
  }
}
