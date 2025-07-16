"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Calendar, Star, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { StatsCards } from "./stats-card";
import { EarningsSummary } from "./earnings-summary";
// import { BookingsCalendar } from "./bookings-calender";
// import { RecentActivity } from "./recent-activity";
import { getArtisanAnalytics } from "@/actions/dashboard/artisans";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
// import { TopServiceOrders } from "./top-service-orders";
import { LatestBookings } from "./analytics/latest-bookings";
import { ArtisanReviews } from "./analytics/artisan-reviews";

export function ArtisansPage() {
  const { currentUser } = useAuth();
  const currentHour = new Date().getHours();

  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  // const [bookingOverview, setBookingOverview] = useState<any[]>([]);

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleFetchOverview = async () => {
    try {
      const response = await getArtisanAnalytics();
      if (!response?.ok) throw new Error("Failed to fetch analytics");

      const res = await response.json();
      console.log("Artisan analytics data:", res);

      const d = res.data;

      // Overview summary stats
      const overview = d.Overview ?? {};

      // Earning summary
      const earnings = d["Earning Summary"] ?? {};

      // Analytics (revenueStats etc)
      const analyticsData = d.Analytics ?? { revenueStats: [] };

      // Booking overview array
      // const bookings = d["Booking Overview"]?.bookingOverview ?? [];

      // Transform stats cards
      const transformedAnalytics = [
        {
          title: "Total Services",
          value: overview.activeListings ?? 0,
          icon: BriefcaseBusiness,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Upcoming Appts",
          value: overview.upcomingBookings ?? 0,
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Total Reviews",
          value: overview.totalReviews ?? 0,
          icon: Star,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          title: "Average Ratings",
          value: overview.averageRating
            ? parseFloat(overview.averageRating).toFixed(1)
            : "0.0",
          icon: Star,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          title: "Active Discounts",
          value: overview.activeDiscounts ?? 0,
          icon: Tag,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
      ];

      // Normalize analytics to pass to components
      const normalizedAnalytics = {
        ...analyticsData, // revenueStats, orderTrends, etc.
        latestBooking: d["Latest Booking"]?.latestBooking || [],
        latestReviews: d["Latest Reviews"]?.latestReviews || [],
        // You can add other normalized keys if needed
      };

      setStatistics(transformedAnalytics);
      setAnalytics({ earnings, statistics: normalizedAnalytics });
      // setBookingOverview(bookings);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchOverview();
  }, []);

  return (
    <main className="flex-1 space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            className="object-cover"
            src={currentUser?.user_photo || "/avatar-fallback.png"}
            alt="Artisan Avatar"
          />
          <AvatarFallback>
            {(currentUser?.firstname?.[0] || "") +
              (currentUser?.lastname?.[0] || "")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {`${getGreeting()}, ${currentUser?.firstname ?? "Artisan"}`}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here&apos;s a quick summary of your activity 📊
          </p>
        </div>
      </div>

      {loading ? (
        <Skeleton className="w-full h-32 rounded-lg" />
      ) : (
        <StatsCards statistics={statistics} />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-9">
        <div className="md:col-span-1 lg:col-span-6">
          {loading || !analytics ? (
            <Skeleton className="w-full h-64 rounded-lg" />
          ) : (
            <EarningsSummary analytics={analytics} />
          )}
        </div>
        <div className="md:col-span-1 lg:col-span-3">
          {loading ? (
            <Skeleton className="w-full h-64 rounded-lg" />
          ) : (
            // <BookingsCalendar bookingOverview={bookingOverview} />
            <ArtisanReviews
              reviews={analytics?.statistics?.latestReviews || []}
            />
          )}
        </div>
      </div>

      {/* Top 10 Service Orders - Replaces the last two sections */}
      {loading ? (
        <Skeleton className="w-full h-64 rounded-lg" />
      ) : (
        // <div className="grid gap-6 md:grid-cols-2">
        <LatestBookings bookings={analytics?.statistics?.latestBooking || []} />

        // </div>
      )}
    </main>
  );
}
