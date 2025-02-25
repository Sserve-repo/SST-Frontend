"use client";

import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function DashboardHeader() {
  const { currentUser } = useAuth();
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex items-center justify-between gap-4">
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
    </div>
  );
}
