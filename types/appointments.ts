export type AppointmentStatus = "pending" | "confirmed" | "completed" | "canceled"
export type PaymentStatus = "pending" | "paid" | "refunded"

export interface AppointmentService {
  id: string
  name: string
  price: number
  duration: number
}

export interface Appointment {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: AppointmentService
  date: Date
  status: AppointmentStatus
  paymentStatus: PaymentStatus
  notes?: string
}

