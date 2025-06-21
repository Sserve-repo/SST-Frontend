"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useToast } from "@/hooks/use-toast";
import {
  getBookingById,
  approveBooking,
  completeBooking,
  cancelBooking,
  rescheduleBooking,
  type BookingDetailResponse,
} from "@/actions/admin/booking-api";
import {
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { RescheduleBookingDialog } from "@/components/admin/bookings/reschedule-booking-dialog";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getBookingById(
        params.id as string
      );

      if (apiError) {
        throw new Error(apiError);
      }

      if (data) {
        setBooking(data);
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch booking details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const handleBookingAction = async (
    action: "approve" | "complete" | "cancel"
  ) => {
    if (!booking) return;

    setIsUpdating(true);
    try {
      let result;
      switch (action) {
        case "approve":
          result = await approveBooking(booking.id.toString());
          break;
        case "complete":
          result = await completeBooking(booking.id.toString());
          break;
        case "cancel":
          result = await cancelBooking(booking.id.toString());
          break;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: `Booking ${action}d successfully.`,
      });

      fetchBooking();
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} booking. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReschedule = async (data: {
    booked_date: string;
    booked_time: string;
  }) => {
    if (!booking) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("booked_date", data.booked_date);
      formData.append("booked_time", data.booked_time);

      const result = await rescheduleBooking(booking.id.toString(), formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Booking rescheduled successfully.",
      });

      fetchBooking();
    } catch (error) {
      console.error("Failed to reschedule booking:", error);
      toast({
        title: "Error",
        description: "Failed to reschedule booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "inprogress":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBooking} />;
  }

  if (!booking) {
    return <ErrorMessage message="Booking not found" onRetry={fetchBooking} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between w-full gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
        <div className="text-right">
          <h1 className="text-xl text-primary font-bold">Booking Details</h1>
          <p className="text-muted-foreground">
            Order #{booking.order.order_no}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary gap-2">
              <DollarSign className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order No:</span>
              <span className="font-medium">{booking.order.order_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">${booking.order.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendor Tax:</span>
              <span>${booking.order.vendor_tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cart Total:</span>
              <span>${booking.order.cart_total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Type:</span>
              <Badge variant="outline">{booking.order.order_type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <Badge
                variant={
                  booking.order.status === "paid" ? "default" : "secondary"
                }
              >
                {booking.order.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary gap-2">
              <Calendar className="h-5 w-5" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={getStatusVariant(booking.booking_status)}>
                {booking.booking_status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">
                {booking.service_listing_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span>{booking.service_category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subcategory:</span>
              <span>{booking.service_subcategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(booking.booked_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>
                {booking.booked_time} - {booking.booked_time_to}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">${booking.price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.customer?.user_photo && (
              <div className="flex items-center gap-3">
                <img
                  src={booking.customer.user_photo || "/placeholder.svg"}
                  alt="Customer"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {booking.customer?.firstname} {booking.customer?.lastname}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{booking.customer?.email}</span>
            </div>
            {booking.customer?.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{booking.customer.phone}</span>
              </div>
            )}
            {booking.customer?.address && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span>{booking.customer.address}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID:</span>
              <span>#{booking.user_id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Artisan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary gap-2">
              <User className="h-5 w-5" />
              Artisan Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.artisan?.user_photo && (
              <div className="flex items-center gap-3">
                <img
                  src={booking.artisan.user_photo || "/placeholder.svg"}
                  alt="Artisan"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {booking.artisan?.firstname} {booking.artisan?.lastname}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{booking.artisan?.email}</span>
            </div>
            {booking.artisan?.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{booking.artisan.phone}</span>
              </div>
            )}
            {booking.artisan?.business_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business:</span>
                <span>{booking.artisan.business_name}</span>
              </div>
            )}
            {booking.artisan?.specialization && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specialization:</span>
                <span>{booking.artisan.specialization}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Artisan ID:</span>
              <span>#{booking.artisan_id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.booking_status === "pending" && (
              <Button
                onClick={() => handleBookingAction("approve")}
                disabled={isUpdating}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Booking
              </Button>
            )}

            {booking.booking_status === "inprogress" && (
              <Button
                onClick={() => handleBookingAction("complete")}
                disabled={isUpdating}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            )}

            {booking.booking_status !== "cancelled" &&
              booking.booking_status !== "completed" && (
                <>
                  <RescheduleBookingDialog
                    onReschedule={handleReschedule}
                    isLoading={isUpdating}
                    currentDate={booking.booked_date}
                    currentTime={booking.booked_time}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  </RescheduleBookingDialog>

                  <Button
                    variant="destructive"
                    onClick={() => handleBookingAction("cancel")}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                </>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
