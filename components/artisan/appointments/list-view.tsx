"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppointmentDetailsDialog } from "./details-dialog";
import { useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointments";

interface AppointmentListViewProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
}

export function AppointmentListView({
  appointments,
  onUpdateAppointment,
}: AppointmentListViewProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  console.log({ appointments });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.service.name}</p>
                    <p className="text-sm text-gray-500">
                      ${appointment.service.price}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {appointment.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
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
                        "bg-blue-100 text-blue-700"
                    )}
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      appointment.paymentStatus === "paid" &&
                        "bg-green-100 text-green-700",
                      appointment.paymentStatus === "pending" &&
                        "bg-yellow-100 text-yellow-700",
                      appointment.paymentStatus === "refunded" &&
                        "bg-red-100 text-red-700"
                    )}
                  >
                    {appointment.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
