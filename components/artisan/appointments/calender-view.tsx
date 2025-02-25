"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppointmentDetailsDialog } from "./details-dialog"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/types/appointments"

interface AppointmentCalendarViewProps {
  appointments: Appointment[]
  onUpdateAppointment: (appointment: Appointment) => void
}

export function AppointmentCalendarView({ appointments, onUpdateAppointment }: AppointmentCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const appointmentsByDate = appointments.reduce(
    (acc, appointment) => {
      const date = appointment.date.toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>,
  )

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="flex gap-2 ">
            <div className="">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                components={{
                  day: ({ date, ...props }) => {
                    const dateString = date.toDateString()
                    const dayAppointments = appointmentsByDate[dateString] || []

                    return (
                      <div
                        {...props}
                        className={cn(
                          "relative h-14 w-14 p-0 focus-within:relative focus-within:z-20 hover:bg-accent",
                          props.className,
                        )}
                      >
                        <time dateTime={date.toDateString()} className="absolute left-1 top-1">
                          {date.getDate()}
                        </time>
                        {dayAppointments.length > 0 && (
                          <div className="absolute bottom-1 left-1 right-1">
                            <div className="flex flex-wrap gap-0.5">
                              {dayAppointments.map((appointment) => (
                                <button
                                  key={appointment.id}
                                  onClick={() => setSelectedAppointment(appointment)}
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    appointment.status === "confirmed" && "bg-green-500",
                                    appointment.status === "pending" && "bg-yellow-500",
                                    appointment.status === "canceled" && "bg-red-500",
                                    appointment.status === "completed" && "bg-blue-500",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  },
                }}
              />
            </div>
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
                  {selectedDate &&
                    appointmentsByDate[selectedDate.toDateString()]?.map((appointment) => (
                      <button
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{appointment.customerName}</p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              appointment.status === "confirmed" && "bg-green-100 text-green-700",
                              appointment.status === "pending" && "bg-yellow-100 text-yellow-700",
                              appointment.status === "canceled" && "bg-red-100 text-red-700",
                              appointment.status === "completed" && "bg-blue-100 text-blue-700",
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
                    ))}
                  {(!selectedDate || !appointmentsByDate[selectedDate.toDateString()]) && (
                    <p className="text-sm text-gray-500">No appointments scheduled</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
        onUpdate={(updatedAppointment) => {
          onUpdateAppointment(updatedAppointment)
          setSelectedAppointment(null)
        }}
      />
    </>
  )
}

