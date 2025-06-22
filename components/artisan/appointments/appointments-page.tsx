"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendarView } from "@/components/artisan/appointments/calender-view";
import { AppointmentListView } from "@/components/artisan/appointments/list-view";
import { AppointmentFilters } from "@/components/artisan/appointments/filters";
import { CalendarDays, List } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@/types/appointments";
import {
  bookingCompleteHandler,
  bookingInprogressHandler,
  getAppointments,
  rescheduleBookingHandler,
} from "@/actions/dashboard/artisans";
import { AppointmentSkeletonList } from "./appointment-skeleton-list";

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("list");
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["all"]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const getStatus = (status: string): Appointment["status"] => {
    switch (status) {
      case "completed":
        return "completed";
      case "inprogress":
        return "inprogress";
      case "pending":
        return "pending";
      case "cancelled":
        return "canceled";
      case "rescheduled":
        return "rescheduled";
      default:
        return "pending";
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments(null);
      if (!response?.ok) throw Error("Cannot fetch appointments data");
      const data = await response.json();

      const bookings = data.data;
      const transformed = bookings.orders?.map(
        (item: any): Appointment => ({
          id: item.id,
          customerName: `${item?.customer?.firstname} ${item?.customer?.lastname}`,
          customerEmail: item?.customer?.email,
          customerPhone: item?.customer?.phone || "",
          service: {
            id: item?.service_detail?.id,
            name: item?.service_detail?.title,
            duration: item?.service_detail?.service_duration,
            serviceCategory: {
              name: item?.service_detail?.service_category?.name,
            },
            price: item?.price,
          },
          date: new Date(`${item?.booked_date}T${item?.booked_time}:00`),
          status: getStatus(item.booking_status),
          paymentStatus: item.status,
          notes: "Regular customer, prefers shorter sessions",
          order: {
            id: item.order.id,
            orderNo: item.order.order_no,
            total: item.order.total,
            vendorTax: item.order.vendor_tax,
            cartTotal: item.order.cart_total,
          },
        })
      );

      setAppointments(transformed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = (status: string[]) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (date: string | null) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleUpdateAppointment = async (updated: Appointment) => {
    const { id, event, date } = updated;
    try {
      let response: Response | undefined;
      if (!id || !event) {
        throw new Error("Invalid appointment data");
      }

      switch (event) {
        case "completed":
          response = await bookingCompleteHandler(id);
          break;
        case "approve":
          response = await bookingInprogressHandler(id);
          break;
        case "reschedule":
          const formData = new FormData();
          formData.append("booked_date", date.toLocaleDateString("en-CA"));
          formData.append(
            "booked_time",
            date.toLocaleTimeString("en-CA", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          response = await rescheduleBookingHandler(id, formData);
          break;
        default:
          return;
      }

      if (!response?.ok) throw new Error("Failed to update appointment");

      let newStatus: Appointment["status"] = updated.status;
      if (event === "approve") newStatus = "inprogress";
      if (event === "completed") newStatus = "completed";
      if (event === "reschedule") newStatus = "rescheduled";

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? { ...updated, status: newStatus }
            : appointment
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${
          event === "approve" ? "approved" : event
        }d successfully`,
      });
    } catch (error) {
      console.error("Appointment update failed:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedStatus.includes("all")) return true;
    return selectedStatus.includes(appointment.status);
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-primary">
          Appointments & Bookings
        </h1>
        <AppointmentSkeletonList count={6} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Appointments & Bookings
          </h1>
          <p className="text-gray-500">
            Manage your upcoming appointments and booking requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>

      <AppointmentFilters
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        onDateFilter={handleDateFilter}
        selectedDate={selectedDate}
      />

      {view === "calendar" ? (
        <AppointmentCalendarView
          appointments={filteredAppointments}
          onUpdateAppointment={handleUpdateAppointment}
        />
      ) : (
        <AppointmentListView
          appointments={paginatedAppointments}
          onUpdateAppointment={handleUpdateAppointment}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
