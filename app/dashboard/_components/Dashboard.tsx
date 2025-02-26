"use client";

import { Overview } from "@/components/dashboard/overview";
import { TransactionList } from "@/components/dashboard/transaction-listing";
import { Messages } from "@/components/dashboard/message";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { RecentProducts } from "@/components/dashboard/recent-products";
import { TopProducts } from "@/components/dashboard/top-products";
import { TopCustomers } from "@/components/dashboard/top-customers";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { useCallback, useEffect, useState } from "react";
import { getServiceOverview, getProductOverview } from "@/actions/dashboard";
import { useAuth } from "@/context/AuthContext";
import type { OverviewType } from "@/types/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [tab, setTab] = useState("products");
  const [overviewData, setOverviewData] = useState<OverviewType | null>(null);
  const { currentUser } = useAuth();
  const currentHour = new Date().getHours();

  const handleFetchOverview = useCallback(async () => {
    let response;

    switch (currentUser?.user_type) {
      case "2": // Shopper
        response = await getProductOverview();
        break;
      case "3": // Vendor
        response =
          tab === "products"
            ? await getProductOverview()
            : await getServiceOverview();
        break;
      case "4": // Artisan
        response = await getServiceOverview();
        break;
      default:
        return;
    }

    if (response && response.ok) {
      const data = await response.json();
      setOverviewData(data.data);
    }
  }, [currentUser?.user_type, tab])


  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    handleFetchOverview();
  }, [handleFetchOverview]);

  // Vendor Dashboard Layout
  if (currentUser?.user_type === "3") {
    return (
      <div className="space-y-6 p-6">
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

            </div>
          )}
        </div>
        <MetricCards />
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9">
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-6">
            <RecentProducts />
          </div>
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-3">
            <TopProducts />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9">
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-6">
            <TopCustomers />
          </div>
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-3">
            <Messages />
          </div>
        </div>
        <EarningsChart />
      </div>
    );
  }

  // Artisan Dashboard Layout
  if (currentUser?.user_type === "4") {
    return (
      <div className="space-y-6 px-4 py-2">
        <Overview overview={overviewData} setTab={setTab} tab={tab} />
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionList
            overview={overviewData}
            setTab={setTab}
            tab={tab}
            className="lg:col-span-1"
          />
          <div className="space-y-6">
            <Messages className="w-full" />
            <EarningsChart />
          </div>
        </div>
      </div>
    );
  }

  // Shopper Dashboard Layout (Default)
  return (
    <div className="space-y-6 px-4 py-2">
      <Overview overview={overviewData} setTab={setTab} tab={tab} />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9">
        <TransactionList
          overview={overviewData}
          setTab={setTab}
          tab={tab}
          className="sm:col-span-1 md:col-span-1 lg:col-span-6"
        />
        <Messages className="sm:col-span-1 md:col-span-1 lg:col-span-3" />
      </div>
    </div>
  );
}
