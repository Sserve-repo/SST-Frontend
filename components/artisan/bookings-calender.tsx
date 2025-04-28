import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar"
// import { useState } from "react"

export function BookingsCalendar({ bookingOverview }) {
  // const [date, setDate] = useState<Date | undefined>(new Date())
  console.log({ bookingOverview });
  const upcomingBookings = bookingOverview.map((item) => {
    return {
      service: item?.service_detail?.title,
      time: item?.booked_time,
      status: item?.booking_status || "confirmed",
    };
  });

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="text-primary">Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" /> */}
          <div className="space-y-2 max-h-64 overflow-y-scroll">
            {upcomingBookings.map((booking, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div>
                  <p className="font-medium">{booking.service}</p>
                  <p className="text-sm text-gray-500">{booking.time}</p>
                </div>
                <Badge
                  variant={
                    booking.status === "confirmed" ? "default" : "secondary"
                  }
                  className={
                    booking.status === "confirmed"
                      ? "bg-green-500"
                      : "bg-yellow-100"
                  }
                >
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingsCalendar;
