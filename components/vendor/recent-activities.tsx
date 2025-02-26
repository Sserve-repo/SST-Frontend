"use client";

import { useState } from "react";
import {
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Activity = {
  id: number;
  type: "order" | "alert" | "message";
  title: string;
  description: string;
  time: string;
  status?: "pending" | "resolved";
};

const initialActivities: Activity[] = [
  {
    id: 1,
    type: "order",
    title: "New Order #1234",
    description: "John Doe placed an order for $156",
    time: "2 mins ago",
    status: "pending",
  },
  {
    id: 2,
    type: "alert",
    title: "Low Stock Alert",
    description: "Product 'Wireless Earbuds' is running low",
    time: "15 mins ago",
    status: "pending",
  },
  {
    id: 3,
    type: "message",
    title: "Customer Inquiry",
    description: "Sarah asked about product availability",
    time: "1 hour ago",
    status: "pending",
  },
];

export function RecentActivities() {
  const [activities, setActivities] = useState(initialActivities);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: Activity["type"]) => {
    switch (type) {
      case "order":
        return "text-blue-500";
      case "alert":
        return "text-yellow-500";
      case "message":
        return "text-green-500";
    }
  };

  const handleResolve = (id: number) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id ? { ...activity, status: "resolved" } : activity
      )
    );
  };

  const handleDismiss = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activities</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between space-x-4 rounded-lg border p-4"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`rounded-full p-2 ${
                    activity.status === "resolved"
                      ? "bg-muted"
                      : "bg-primary/10"
                  }`}
                >
                  <span className={getIconColor(activity.type)}>
                    {getIcon(activity.type)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {activity.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResolve(activity.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismiss(activity.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
