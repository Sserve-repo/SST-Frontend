"use client";
import { StatsCards } from "./stats-card";
import { useAuth } from "@/context/AuthContext";
import { EarningsSummary } from "./earnings-summary";
import { BookingsCalendar } from "./bookings-calender";
import { RecentActivity } from "./recent-activity";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ArtisansPage() {
  const { currentUser } = useAuth();
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };
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
      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-9">
        <div className="md:col-span-1 lg:col-span-6">
          <EarningsSummary />
        </div>
        <div className="md:col-span-1 lg:col-span-3">
          <BookingsCalendar />
        </div>
      </div>

      <RecentActivity />
    </main>
  );
}
