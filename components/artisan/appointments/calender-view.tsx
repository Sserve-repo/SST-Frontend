"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/types/appointments";
import type { JSX } from "react"; // Import JSX to fix the undeclared variable error

interface CalendarViewProps {
  appointments: Appointment[];
  onStatusUpdate: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

export function CalendarView({
  appointments,
  onStatusUpdate,
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-600";
      case "inprogress":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      case "rescheduled":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const hasAppointments = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const getStatusActions = (appointment: Appointment): JSX.Element[] => {
    const actions: JSX.Element[] = [];

    if (appointment.status === "pending") {
      actions.push(
        <Button
          key="confirm"
          size="sm"
          onClick={() => onStatusUpdate(appointment.id, "confirmed")}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Confirm
        </Button>
      );
    }

    if (appointment.status === "confirmed") {
      actions.push(
        <Button
          key="start"
          size="sm"
          onClick={() => onStatusUpdate(appointment.id, "inprogress")}
        >
          <PlayCircle className="h-4 w-4 mr-1" />
          Start
        </Button>
      );
    }

    if (appointment.status === "inprogress") {
      actions.push(
        <Button
          key="complete"
          size="sm"
          onClick={() => onStatusUpdate(appointment.id, "completed")}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Complete
        </Button>
      );
    }

    if (
      appointment.status !== "completed" &&
      appointment.status !== "cancelled"
    ) {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          onClick={() => onStatusUpdate(appointment.id, "cancelled")}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      );
    }

    return actions;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-2xl">Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            modifiers={{
              hasAppointments: (date) => hasAppointments(date),
            }}
            modifiersStyles={{
              hasAppointments: {
                backgroundColor: "#3b82f6",
                color: "white",
                fontWeight: "bold",
              },
            }}
          />
          <div className="mt-4 space-x-2 flex items-center justify-between">
            <div className="text-sm font-medium">Legend:</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Has appointments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments for Selected Date */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            Appointments for{" "}
            {selectedDate?.toLocaleDateString() || "Select a date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled for this date
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={appointment.customerName}
                        />
                        <AvatarFallback>
                          {appointment.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="font-medium">
                          {appointment.customerName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.serviceName}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.time} ({appointment.duration}min)
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />$
                            {appointment.price}
                          </div>
                        </div>
                        {appointment.customerEmail && (
                          <p className="text-xs text-gray-500 mt-1">
                            {appointment.customerEmail}
                          </p>
                        )}
                        {appointment.notes && (
                          <p className="text-xs text-gray-600 mt-1">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace("_", " ")}
                      </Badge>

                      <div className="flex flex-wrap gap-1">
                        {getStatusActions(appointment)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
