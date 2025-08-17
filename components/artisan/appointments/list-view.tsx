"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppointmentDetailsDialog } from "./details-dialog";
import { RescheduleBookingDialog } from "@/components/admin/bookings/reschedule-booking-dialog";
import { cn, convertTime } from "@/lib/utils";
import type { Appointment } from "@/types/appointments";

interface AppointmentListViewProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function AppointmentListView({
  appointments,
  onUpdateAppointment,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: AppointmentListViewProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<Appointment | null>(null);

  const handleReschedule = (data: {
    booked_date: string;
    booked_time: string;
  }) => {
    if (!rescheduleAppointment) return;
    const [hours, minutes] = data.booked_time.split(":");
    const newDate = new Date(data.booked_date);
    newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    onUpdateAppointment({
      ...rescheduleAppointment,
      date: newDate,
      event: "reschedule",
    });
    setRescheduleAppointment(null);
  };

  const handleQuickAction = (appointment: Appointment, action: string) => {
    onUpdateAppointment({ ...appointment, event: action });
  };

  const renderTableRows = () => {
    if (!appointments || appointments.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={7}
            className="text-center py-6 text-sm text-gray-500"
          >
            No appointments found
          </TableCell>
        </TableRow>
      );
    }

    return appointments.map((appointment, index) => (
      <TableRow key={appointment.id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{appointment.order.orderNo}</TableCell>
        <TableCell>
          <div>
            <p className="font-medium">{appointment.customerName}</p>
            <p className="text-sm text-gray-500">{appointment.customerEmail}</p>
            {appointment.customerPhone && (
              <p className="text-sm text-gray-500">{appointment.customerPhone}</p>
            )}
            {appointment.customerAddress && (
              <p className="text-sm text-gray-500">{appointment.customerAddress}</p>
            )}
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
          <p className="font-medium">{convertTime(appointment.date as any)}</p>
        </TableCell>
        <TableCell>
          <Badge
            variant="secondary"
            className={cn(
              appointment.status === "confirmed" &&
                "bg-green-100 text-green-700",
              appointment.status === "pending" &&
                "bg-yellow-100 text-yellow-700",
              appointment.status === "cancelled" && "bg-red-100 text-red-700",
              appointment.status === "completed" && "bg-blue-100 text-blue-700",
              appointment.status === "rescheduled" &&
                "bg-purple-100 text-purple-700",
              appointment.status === "inprogress" &&
                "bg-orange-100 text-orange-700"
            )}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSelectedAppointment(appointment)}
              >
                View Details
              </DropdownMenuItem>
              {["pending", "confirmed"].includes(appointment.status) && (
                <>
                  <DropdownMenuItem
                    onClick={() => setRescheduleAppointment(appointment)}
                  >
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleQuickAction(appointment, "approve")}
                  >
                    Start Service
                  </DropdownMenuItem>
                </>
              )}
              {appointment.status === "inprogress" && (
                <DropdownMenuItem
                  onClick={() => handleQuickAction(appointment, "completed")}
                >
                  Mark Completed
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="rounded-xl bg-white border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Order No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>

        {totalPages > 1 && onPageChange && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * 10 + 1}-
              {Math.min(currentPage * 10, appointments.length)} of{" "}
              {appointments.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) setSelectedAppointment(null);
        }}
        onUpdate={(updatedAppointment) => {
          onUpdateAppointment(updatedAppointment);
          setSelectedAppointment(null);
        }}
      />

      {rescheduleAppointment && (
        <RescheduleBookingDialog
          onReschedule={handleReschedule}
          isLoading={false}
          currentDate={rescheduleAppointment.date.toISOString().split("T")[0]}
          currentTime={rescheduleAppointment.date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        >
          <div />
        </RescheduleBookingDialog>
      )}
    </>
  );
}
