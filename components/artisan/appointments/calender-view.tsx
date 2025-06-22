"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentDetailsDialog } from "./details-dialog";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointments";
import { format } from "date-fns";

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
}

export function AppointmentCalendarView({
  appointments,
  onUpdateAppointment,
}: AppointmentCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const key = format(appointment.date, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="flex gap-2">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
                components={
                  {
                    day: ({ date, ...props }) => {
                      const key = format(date, "yyyy-MM-dd");
                      const dayAppointments = appointmentsByDate?.[key] || [];

                      return (
                        <div
                          {...props}
                          className={cn(
                            "relative h-14 w-14 p-0 focus-within:relative focus-within:z-20 hover:bg-accent transition-all",
                            props.className
                          )}
                        >
                          <time
                            dateTime={date.toISOString()}
                            className="absolute left-1 top-1 text-xs"
                          >
                            {date.getDate()}
                          </time>

                          {dayAppointments.length > 0 && (
                            <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5 justify-center">
                              {dayAppointments.map((appointment) => (
                                <button
                                  key={appointment.id}
                                  onClick={() =>
                                    setSelectedAppointment(appointment)
                                  }
                                  title={appointment.service.name}
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    appointment.status === "confirmed" &&
                                      "bg-green-500",
                                    appointment.status === "pending" &&
                                      "bg-yellow-500",
                                    appointment.status === "canceled" &&
                                      "bg-red-500",
                                    appointment.status === "completed" &&
                                      "bg-blue-500",
                                    appointment.status === "rescheduled" &&
                                      "bg-purple-500",
                                    appointment.status === "inprogress" &&
                                      "bg-orange-500"
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    },
                  } as any
                }
              />
            </div>

            {/* Appointment List */}
            <div className="border-l p-4 w-full">
              <div className="space-y-4">
                <h3 className="font-semibold">
                  {selectedDate?.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                <div className="space-y-2 w-full">
                  {appointmentsByDate?.[dateKey]?.length > 0 ? (
                    appointmentsByDate[dateKey].map((appointment) => (
                      <button
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full rounded-lg border p-3 text-left hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {appointment.customerName}
                          </p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              appointment.status === "confirmed" &&
                                "bg-green-100 text-green-700",
                              appointment.status === "pending" &&
                                "bg-yellow-100 text-yellow-700",
                              appointment.status === "canceled" &&
                                "bg-red-100 text-red-700",
                              appointment.status === "completed" &&
                                "bg-blue-100 text-blue-700",
                              appointment.status === "rescheduled" &&
                                "bg-purple-100 text-purple-700",
                              appointment.status === "inprogress" &&
                                "bg-orange-100 text-orange-700"
                            )}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {appointment.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {appointment.service.name}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No appointments scheduled.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
        onUpdate={(updatedAppointment) => {
          onUpdateAppointment(updatedAppointment);
          setSelectedAppointment(null);
        }}
      />
    </>
  );
}
