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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  CalendarIcon,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  PlayCircle,
  Clock2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointments";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (appointment: Appointment) => void;
}
// ✂️ All your existing imports remain the same

export function AppointmentDetailsDialog({
  appointment,
  open,
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
      event: "status_update",
    });
    onOpenChange(false);
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) return;

    const [hours, minutes] = newTime.split(":");
    const updatedDate = new Date(newDate);
    updatedDate.setHours(Number.parseInt(hours), Number.parseInt(minutes));

    onUpdate({
      ...appointment,
      date: updatedDate,
      time: newTime,
      event: "reschedule",
    });
    setShowReschedule(false);
    onOpenChange(false);
  };

  const handleApproveBooking = () => {
    onUpdate({
      ...appointment,
      status: "inprogress",
      event: "approve",
    });
    onOpenChange(false);
  };

  const timeSlots = Array.from({ length: 24 * 2 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      case "completed":
        return "bg-green-100 text-green-800 border border-green-300";
      case "inprogress":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "rescheduled":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              Appointment Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 px-1 pb-2">
            {/* Status */}
            <div className="flex justify-center">
              <Badge
                className={cn(
                  "text-sm px-4 py-2",
                  getStatusColor(appointment.status)
                )}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
            </div>

            {/* Customer Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="rounded-xl border p-4 bg-muted/30 flex gap-4 items-center">
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
                <div>
                  <p className="font-semibold text-lg">
                    {appointment.customerName}
                  </p>
                  <div className="text-sm text-muted-foreground mt-1 space-x-4">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {appointment.customerEmail}
                    </span>
                    {appointment.customerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />{" "}
                        {appointment.customerPhone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Service */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Service Details
              </h3>
              <div className="rounded-xl border p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30">
                <Detail label="Service Name" value={appointment.service.name} />
                <Detail
                  label="Price"
                  value={
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {appointment.service.price}
                    </span>
                  }
                />
                <Detail
                  label="Duration"
                  value={
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.service.duration} mins
                    </span>
                  }
                />
                <Detail
                  label="Service ID"
                  value={`#${appointment.serviceId}`}
                />
              </div>
            </section>

            {/* Appointment Time */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Appointment Schedule
              </h3>
              <div className="rounded-xl border p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30">
                <Detail
                  label="Date"
                  value={appointment.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <Detail label="Time" value={appointment.time} />
              </div>
            </section>

            {/* Order Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Order Information
              </h3>
              <div className="rounded-xl border p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30">
                <Detail
                  label="Order ID"
                  value={`#${appointment.order.orderNo}`}
                />
                <Detail
                  label="Total Amount"
                  value={`$${appointment.order.total}`}
                />
                <Detail
                  label="Payment Status"
                  value={
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {appointment.paymentStatus}
                    </Badge>
                  }
                />
              </div>
            </section>

            {/* Notes */}
            {appointment.notes && (
              <section className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-5 w-5" />
                  Notes
                </h3>
                <div className="rounded-xl border p-4 bg-muted/30">
                  <p className="text-gray-800">{appointment.notes}</p>
                </div>
              </section>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
              {["pending", "confirmed"].includes(appointment.status) && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowReschedule(true)}
                  >
                    <Clock2 className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button onClick={handleApproveBooking}>
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Start Service
                  </Button>
                </>
              )}
              {appointment.status === "inprogress" && (
                <Button
                  onClick={() => handleStatusUpdate("completed")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Completed
                </Button>
              )}
              {appointment.status !== "completed" &&
                appointment.status !== "cancelled" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate("cancelled")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel Appointment
                  </Button>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Reschedule Appointment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select New Date</label>
              <Calendar
                mode="single"
                selected={newDate}
                onSelect={setNewDate}
                className="rounded-md border w-full"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select New Time</label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReschedule(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={!newDate || !newTime}
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// 💡 Reusable field-value block
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  );
}
