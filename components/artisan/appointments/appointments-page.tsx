"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendarView } from "@/components/artisan/appointments/calender-view";
import { AppointmentListView } from "@/components/artisan/appointments/list-view";
import { AppointmentFilters } from "@/components/artisan/appointments/filters";
import { CalendarDays, List } from "lucide-react";
import type { Appointment } from "@/types/appointments";
import { getAppointments } from "@/actions/dashboard/artisans";

// const statusStyles = {
//   success: "bg-emerald-50 text-emerald-700",
//   pending: "bg-purple-50 text-purple-700",
//   processing: "bg-purple-50 text-purple-700",
//   cancelled: "bg-red-50 text-red-700",
//   "In Transit": "bg-blue-50 text-blue-700",
// };

// const paymentStatusStyles = {
//   success: "bg-green-100 text-green-600",
//   pending: "bg-yellow-100 text-yellow-600",
// };

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("list");
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["all"]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleFetchServiceListings = async () => {
    try {
      const response = await getAppointments(null);
      if (!response?.ok) {
        throw Error("Cannot fetch appointments data");
      }
      const data = await response.json();

      const bookings = data.data;
      const transformedAppointmentList = bookings.orders?.map((item) => {
        return {
          id: item.id,
          customerName: `${item?.customer?.firstname} ${item?.customer?.lastname}`,
          customerEmail: item?.customer?.email,
          customerPhone: item?.customer?.phone || "",
          service: {
            id: item?.service_detail?.id,
            name: item?.service_detail?.title,
            serviceCategory: {
              name: item.service_detail?.service_category?.name
            },
            price: item?.price,
            // duration: 60,
          },
          date: new Date(`${item?.booked_date}T${item?.booked_time}:00`),
          status: item.booking_status,
          paymentStatus: item.status,
          notes: "Regular customer, prefers shorter sessions",
          order: {
            id: item.order.id,
            orderNo: item.order.order_no,
            total: item.order.total,
            vendorTax: item.order.vendor_tax,
            cartTotal: item.order.cart_total,
          },
        };
      });
      setAppointments(transformedAppointmentList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchServiceListings();
  }, []);

  const handleStatusChange = (status: string[]) => {
    setSelectedStatus(status);
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? updatedAppointment
          : appointment
      )
    );
  };

  const filteredAppointments = appointments?.filter((appointment) => {
    if (selectedStatus.includes("all")) return true;
    return selectedStatus?.includes(appointment?.status);
  });

  // const handleExport = () => {
  //   const data = appointments.map((appointment) => ({
  //     "Customer Name": appointment.customerName,
  //     Service: appointment.service.name,
  //     Date: appointment.date.toLocaleString(),
  //     Status: appointment.status,
  //     "Payment Status": appointment.paymentStatus,
  //     Price: `$${appointment.service.price}`,
  //   }));

  //   exportToCSV(data, "appointments.csv");
  // };

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
        <div className="flex flex-wrap items-center gap-4 flex-col">
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
            {/* <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>
        </div>
      </div>

      <>
        <AppointmentFilters
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />

        {view === "calendar" ? (
          <AppointmentCalendarView
            onUpdateAppointment={handleUpdateAppointment}
          />
        ) : (
          <AppointmentListView
            appointments={filteredAppointments}
            onUpdateAppointment={handleUpdateAppointment}
          />
        )}
      </>
    </div>
  );
}
