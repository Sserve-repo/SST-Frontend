"use client";
import { StatsCards } from "./stats-card";
import { useAuth } from "@/context/AuthContext";
import { EarningsSummary } from "./earnings-summary";
import { BookingsCalendar } from "./bookings-calender";
import { RecentActivity } from "./recent-activity";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { getArtisanAnalytics } from "@/actions/dashboard/artisans";
import { BriefcaseBusiness, Calendar, Star, Tag } from "lucide-react";

export function ArtisansPage() {
  const { currentUser } = useAuth();
  const currentHour = new Date().getHours();
  const [statistics, setStatistics] = useState<any>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [bookingOverview, setbookingOverview] = useState<any>([]);

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleFetchOverview = async () => {
    try {
      const response = await getArtisanAnalytics();
      if (!response?.ok) {
        throw Error("Cannot fetch analytics data");
      }
      const data = await response.json();
      const overview = data.data["Overview"];
      const transformedAnalytics = [
        {
          title: "Total Services",
          value: overview?.activeListings,
          change: "",
          icon: BriefcaseBusiness,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Upcoming Appointments",
          value: overview?.upcomingBookings,
          change: "3 today",
          icon: Calendar,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Total Reviews",
          value: overview?.totalReviews,
          change: "+12 reviews",
          icon: Star,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          title: "Average Ratings",
          value: overview?.averageRating,
          change: "+12 reviews",
          icon: Star,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          title: "Active Promotions",
          value: overview?.count,
          change: "Ends in 5 days",
          icon: Tag,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
      ];

      const { Analytics } = data.data;
      const earnings = data.data["Earning Summary"];
      const bookingOverview = data.data["Booking Overview"]["bookingOverview"];
      setbookingOverview(bookingOverview)

      setStatistics(transformedAnalytics);
      setAnalytics({ earnings, statistics: Analytics });
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchOverview();
  }, []);

  return (
    <main className="flex-1 space-y-6 p-4">
      <div className="flex items-center space-x-2">
        <Avatar className="h-24 w-24 aspect-square">
          <AvatarImage
            className="aspect-square"
            src={currentUser?.user_photo}
          />
          <AvatarFallback>
            {currentUser?.firstname[0] + currentUser?.lastname[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {`${getGreeting()} ${currentUser?.firstname}`}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            How are you today? 😊
          </p>
        </div>
      </div>
      <StatsCards statistics={statistics} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-9">
        <div className="md:col-span-1 lg:col-span-6">
          <EarningsSummary analytics={analytics} />
        </div>
        <div className="md:col-span-1 lg:col-span-3">
          <BookingsCalendar  bookingOverview={bookingOverview}/>
        </div>
      </div>

      <RecentActivity />
    </main>
  );
}
