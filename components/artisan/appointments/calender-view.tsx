"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  PlayCircle,
  Eye,
  Phone,
  Mail,
} from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/types/appointments";

interface CalendarViewProps {
  appointments: Appointment[];
  onStatusUpdate: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onViewDetails: (appointment: Appointment) => void;
}

export function CalendarView({
  appointments,
  onStatusUpdate,
  onViewDetails,
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
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "inprogress":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-600 border-red-200";
      case "rescheduled":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
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
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
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
          className="flex items-center gap-1"
        >
          <PlayCircle className="h-3 w-3" />
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
          className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
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
          className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
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
        <CardHeader className=" px-4 pt-3 pb-0">
          <CardTitle className="flex items-center text-lg gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 py-2 space-y-2">
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
                borderRadius: "6px",
              },
            }}
          />
          <div className="mt-6 space-y-3">
            <div className="text-sm font-medium text-gray-700">Legend:</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Has appointments</span>
              </div>
              <div className="text-xs text-gray-500">
                Click on a date to view appointments
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments for Selected Date */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">
            Appointments for{" "}
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) || "Select a date"}
          </CardTitle>
          {selectedDateAppointments.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedDateAppointments.length} appointment
              {selectedDateAppointments.length !== 1 ? "s" : ""} scheduled
            </p>
          )}
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CalendarIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments scheduled
              </h3>
              <p className="text-gray-500">
                No appointments found for this date. Select another date to view
                appointments.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src="/assets/images/image-placeholder.png"
                            alt={appointment.customerName}
                          />
                          <AvatarFallback className="bg-primary text-white">
                            {appointment.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {appointment.customerName}
                              </h4>
                              <p className="text-sm text-gray-600 font-medium">
                                {appointment.serviceName}
                              </p>
                            </div>
                            <Badge
                              className={`${getStatusColor(
                                appointment.status
                              )} border`}
                            >
                              {appointment.status.replace("_", " ")}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>
                                {appointment.time} ({appointment.duration}min)
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span className="font-medium">
                                ${appointment.price}
                              </span>
                            </div>
                            {appointment.customerEmail && (
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="truncate">
                                  {appointment.customerEmail}
                                </span>
                              </div>
                            )}
                            {appointment.customerPhone && (
                              <div className="flex items-center text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{appointment.customerPhone}</span>
                              </div>
                            )}
                          </div>

                          {appointment.notes && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-between items-center gap-2 mt-4 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(appointment)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>

                      <div className="flex flex-wrap gap-2">
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
