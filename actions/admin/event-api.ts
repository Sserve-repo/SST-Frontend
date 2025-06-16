import { apiRequest } from "@/hooks/use-api"

export interface Event {
    id: number
    title: string
    image: string
    description: string
    event_type: string
    location: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    capacity: string
    url: string
    address: string
    created_at: string
    updated_at: string
    status: string
}

export interface EventListResponse {
    total_events: number
    upcoming_events: number
    completed_events: number
    events: Event[]
}

export interface EventDetailResponse {
    id: number
    title: string
    image: string
    description: string
    event_type: string
    location: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    capacity: string
    url: string
    address: string
    created_at: string
    updated_at: string
    status: string
}

export async function getEvents() {
    return apiRequest<EventListResponse>(`/admin/dashboard/events/list`)
}

export async function getEventById(id: string) {
    return apiRequest<EventDetailResponse>(`/admin/dashboard/events/show/${id}`)
}

export async function createEvent(formData: FormData) {
    return apiRequest<Event>(`/admin/dashboard/events/create`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}

export async function deleteEvent(id: string) {
    return apiRequest<any>(`/admin/dashboard/events/destroy/${id}`)
}

export async function updateEvent(id: string, formData: FormData) {
    return apiRequest<Event>(`/admin/dashboard/events/update/${id}`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}
