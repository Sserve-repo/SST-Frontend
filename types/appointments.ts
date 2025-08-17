export type AppointmentStatus = "pending" | "confirmed" | "inprogress" | "completed" | "cancelled" | "rescheduled"
export type PaymentStatus = "paid" | "pending" | "failed"

export interface AppointmentService {
  id: string
  name: string
  price: number
  duration: number
}

export interface AppointmentOrder {
  id: string
  orderNo: string
  total: string
  vendorTax: string
  cartTotal: string
}

export interface Appointment {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  customerLatitude?: number
  customerLongitude?: number
  service: AppointmentService
  serviceName: string
  serviceId: string
  date: Date
  time: string
  duration: number
  status: AppointmentStatus
  paymentStatus: PaymentStatus
  price: number
  notes?: string
  order: AppointmentOrder
  event?: string
  createdAt: Date
  updatedAt: Date
}

export interface AppointmentFilters {
  status?: AppointmentStatus[]
  dateRange?: {
    from: Date
    to: Date
  }
  serviceId?: string
}

export interface RescheduleData {
  booked_date: string
  booked_time: string
}
