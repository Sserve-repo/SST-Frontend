export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "canceled";
export type PaymentStatus = "pending" | "success" | "refunded";

export interface AppointmentService {
  id: string;
  name: string;
  price: number;
  duration: number;
  serviceCategory: {
    name: string;
  };
}

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: AppointmentService;
  date: Date;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  order: {
    id: string;
    orderNo: string;
    total: string;
    vendorTax: string;
    cartTotal: string;
  };
}
