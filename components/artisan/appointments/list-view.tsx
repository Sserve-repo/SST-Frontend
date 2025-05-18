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
import { cn, convertTime } from "@/lib/utils";
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
              <TableHead>S/N</TableHead>
              <TableHead>Order No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments?.map((appointment, index) => (
              <TableRow key={appointment.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{appointment.order.orderNo}</TableCell>
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
                      {convertTime(appointment.date as any)}
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
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      appointment.paymentStatus === "success" &&
                        "bg-green-100 text-green-700",
                      appointment.paymentStatus === "pending" &&
                        "bg-yellow-100 text-yellow-700",
                      appointment.paymentStatus === "refunded" &&
                        "bg-red-100 text-red-700"
                    )}
                  >
                    {appointment.paymentStatus.charAt(0).toUpperCase() +
                      appointment.paymentStatus.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
          <p className="text-sm text-gray-500">Showing 1-09 of 78</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
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
