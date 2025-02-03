"use client";

import {
  Wallet,
  ShoppingBag,
  History,
  PenToolIcon as Tool,
  Package,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import type { Dispatch, SetStateAction } from "react";
import type { OverviewType } from "@/types/dashboard";

interface OverviewProps {
  overview: OverviewType | null;
  setTab: Dispatch<SetStateAction<string>>;
  tab: string;
  className?: string;
}

const getRoleBasedMetrics = (
  role: string,
  overview: OverviewType | null,
  tab: string
) => {
  switch (role) {
    case "2": // Shopper
      return [
        {
          title: "Total Expenditure",
          value: overview?.TotalExpenditure || "$0",
          icon: <Wallet className="h-6 w-6 text-emerald-500" />,
          bgColor: "bg-emerald-50",
          subText: `${overview?.pendingOrder || 0} Pending Orders`,
        },
        {
          title: "Orders Received",
          value: overview?.completeOrder || "0",
          icon: <Package className="h-6 w-6 text-purple-500" />,
          bgColor: "bg-purple-50",
          subText: `${overview?.orderInProgress || 0} In Transit`,
        },
        {
          title: "Services Booked",
          value: overview?.completedService || "0",
          icon: <Tool className="h-6 w-6 text-orange-500" />,
          bgColor: "bg-orange-50",
          subText: `${overview?.pendingService || 0} Pending Services`,
        },
      ];
    case "3": // Vendor
      return [
        {
          title: "Total Sales",
          value: overview?.TotalExpenditure || "$0",
          icon: <Wallet className="h-6 w-6 text-emerald-500" />,
          bgColor: "bg-emerald-50",
          subText: `${overview?.pendingOrder || 0} Pending Orders`,
        },
        {
          title:
            tab === "products" ? "Products Delivered" : "Services Completed",
          value:
            tab === "products"
              ? overview?.completeOrder
              : overview?.completedService || "0",
          icon: <ShoppingBag className="h-6 w-6 text-purple-500" />,
          bgColor: "bg-purple-50",
          subText: `${
            tab === "products"
              ? overview?.orderInProgress
              : overview?.serviceInProgress || 0
          } In Progress`,
        },
        {
          title:
            tab === "products" ? "Products In Transit" : "Services Pending",
          value:
            tab === "products"
              ? overview?.orderInProgress
              : overview?.pendingService || "0",
          icon: <History className="h-6 w-6 text-orange-500" />,
          bgColor: "bg-orange-50",
          subText: `${
            tab === "products"
              ? overview?.cancelledOrder
              : overview?.cancelledService || 0
          } Cancelled`,
        },
      ];
    case "4": // Artisan
      return [
        {
          title: "Total Earnings",
          value: overview?.TotalExpenditure || "$0",
          icon: <Wallet className="h-6 w-6 text-emerald-500" />,
          bgColor: "bg-emerald-50",
          subText: `${overview?.pendingService || 0} Pending Services`,
        },
        {
          title: "Services Completed",
          value: overview?.completedService || "0",
          icon: <Tool className="h-6 w-6 text-purple-500" />,
          bgColor: "bg-purple-50",
          subText: `${overview?.serviceInProgress || 0} In Progress`,
        },
        {
          title: "Active Requests",
          value: overview?.pendingService || "0",
          icon: <History className="h-6 w-6 text-orange-500" />,
          bgColor: "bg-orange-50",
          subText: `${overview?.cancelledService || 0} Cancelled`,
        },
      ];
    default:
      return [];
  }
};

export function Overview({ overview, tab, setTab }: OverviewProps) {
  const currentHour = new Date().getHours();
  const { currentUser } = useAuth();

  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const metrics = getRoleBasedMetrics(currentUser?.user_type, overview, tab);

  return (
    <div className="flex-1 space-y-4 mt-2">
      <div className="flex items-center justify-between space-y-2 md:space-y-0 md:flex-row flex-col">
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
        {currentUser?.user_type === "3" && (
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Tabs defaultValue={tab} className="space-y-4 bg-white">
              <TabsList className="flex space-x-4 bg-white p-1 rounded-lg border border-gray-200">
                <TabsTrigger
                  onClick={() => setTab("products")}
                  value="products"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger onClick={() => setTab("service")} value="service">
                  Service
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`rounded-2xl ${metric.bgColor} p-4`}>
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {metric.title}
                </p>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium text-emerald-600">
                {metric.subText}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
