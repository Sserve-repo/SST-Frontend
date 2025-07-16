"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Star,
  Calendar,
  CalendarCheck,
  Percent,
  MessageSquare,
} from "lucide-react";

interface Overview {
  activeListings: number;
  averageRating: string;
  totalReviews: number;
  upcomingBookings: number;
  upcomingBookingsToday: number;
  activeDiscounts: number;
}

interface ArtisanOverviewProps {
  overview: Overview;
}

export function ArtisanOverview({ overview }: ArtisanOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.activeListings}</div>
          <p className="text-xs text-muted-foreground">
            Services currently available
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Number.parseFloat(overview.averageRating).toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            From {overview.totalReviews} reviews
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            Customer feedback received
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Bookings
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.upcomingBookings}</div>
          <p className="text-xs text-muted-foreground">
            Scheduled appointments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today&apos;s Bookings
          </CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview.upcomingBookingsToday}
          </div>
          <p className="text-xs text-muted-foreground">Appointments today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Discounts
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.activeDiscounts}</div>
          <p className="text-xs text-muted-foreground">Current promotions</p>
        </CardContent>
      </Card>
    </div>
  );
}
