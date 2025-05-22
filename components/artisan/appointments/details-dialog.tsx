"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointments";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (appointment: Appointment) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  onOpenChange,
  onUpdate,
}: AppointmentDetailsDialogProps) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState<string>("");

  if (!appointment) return null;

  const handleStatusUpdate = (newStatus: Appointment["status"]) => {
    onUpdate({
      ...appointment,
      status: newStatus,
      event: "completed",
    });
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) return;

    const [hours, minutes] = newTime.split(":");
    const updatedDate = new Date(newDate);
    updatedDate.setHours(Number.parseInt(hours), Number.parseInt(minutes));

    onUpdate({
      ...appointment,
      date: updatedDate,
      event: "reschedule",
    });
    setShowReschedule(false);
  };

  const handleApproveBooking = (event) => {
    onUpdate({
      ...appointment,
      status: "canceled",
      event,
    });
    // setShowCancel(false);
  };

  const timeSlots = Array.from({ length: 24 * 2 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  return (
    <>
      <Dialog open={!!appointment} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-primary text-2xl">
              Appointment Details
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Customer Information</h3>
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
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium">
                  {appointment.customerName}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.customerEmail}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.customerPhone}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="font-semibold">Service Details</h3>
              <div className="grid gap-1  text-gray-500">
                <p className="text-sm font-medium ">
                  Name:{" "}
                  {appointment.service.name.charAt(0).toUpperCase() +
                    appointment.service.name.slice(1)}
                </p>
                <p className="text-sm font-medium mb-3">
                  Category:{" "}
                  {appointment.service?.serviceCategory?.name
                    .charAt(0)
                    .toUpperCase() +
                    appointment.service?.serviceCategory?.name.slice(1)}
                </p>
                <p className="text-sm text-gray-500">
                  Duration: {appointment.service.duration} minutes
                </p>
                <p className="text-sm text-gray-500">
                  Price: ${appointment.service.price}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="font-semibold">Appointment Time</h3>
              <p className="text-sm">
                {appointment.date.toLocaleDateString()}{" "}
                {appointment.date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {appointment.notes && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm text-gray-500">{appointment.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {["pending", "confirmed"].includes(appointment.status) && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowReschedule(true)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleApproveBooking("approve")}
                  >
                    In Progress
                  </Button>
                </>
              )}

              {appointment.status === "inprogress" && (
                <Button
                  // variant="default"
                  className="bg-green-600"
                  onClick={() => handleStatusUpdate("completed")}
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              className="rounded-md border"
            />
            <Select value={newTime} onValueChange={setNewTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReschedule(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleReschedule}>Confirm Reschedule</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
