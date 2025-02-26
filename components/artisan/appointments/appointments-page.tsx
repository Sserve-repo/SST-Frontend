"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentCalendarView } from "@/components/artisan/appointments/calender-view";
import { AppointmentListView } from "@/components/artisan/appointments/list-view";
import { AppointmentFilters } from "@/components/artisan/appointments/filters";
import { exportToCSV } from "@/lib/export";
import { CalendarDays, List, Download } from "lucide-react";
import type { Appointment } from "@/types/appointments";

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["all"]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      customerPhone: "+1234567890",
      service: {
        id: "1",
        name: "Haircut & Styling",
        price: 50,
        duration: 60,
      },
      date: new Date("2025-02-25T10:00:00"),
      status: "confirmed",
      paymentStatus: "paid",
      notes: "Regular customer, prefers shorter sessions",
    },
    {
      id: "2",
      customerName: "Michael Brown",
      customerEmail: "michael@example.com",
      customerPhone: "+1234567891",
      service: {
        id: "2",
        name: "Hair Coloring",
        price: 120,
        duration: 120,
      },
      date: new Date("2025-02-25T14:00:00"),
      status: "pending",
      paymentStatus: "pending",
      notes: "First-time customer",
    },
    // Add more sample appointments as needed
  ]);

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

  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedStatus.includes("all")) return true;
    return selectedStatus.includes(appointment.status);
  });

  const handleExport = () => {
    const data = appointments.map((appointment) => ({
      "Customer Name": appointment.customerName,
      Service: appointment.service.name,
      Date: appointment.date.toLocaleString(),
      Status: appointment.status,
      "Payment Status": appointment.paymentStatus,
      Price: `$${appointment.service.price}`,
    }));

    exportToCSV(data, "appointments.csv");
  };

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
        <div className="flex flex-wrap items-center gap-4">
          <AppointmentFilters
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
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
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {view === "calendar" ? (
        <AppointmentCalendarView
          appointments={filteredAppointments}
          onUpdateAppointment={handleUpdateAppointment}
        />
      ) : (
        <AppointmentListView
          appointments={filteredAppointments}
          onUpdateAppointment={handleUpdateAppointment}
        />
      )}
    </div>
  );
}
