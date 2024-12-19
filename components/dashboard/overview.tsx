"use client";
import { Wallet, ShoppingBag, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getOverview } from "@/actions/dashboard";

type OverviewType = {
  Transactions: any;
  TotalExpenditure: string;
  orderInProgress: string;
  cancelleOrder: string;
  pendingOrder: string;
  completeOrder: string;
};
export function Overview() {
  const currentHour = new Date().getHours();
  const { currentUser } = useAuth();
  const [overviewData, setOverviewData] = useState<OverviewType | null>(null);

  const handleFetchOverview = async () => {
    const response = await getOverview();
    if (response && response.ok) {
      const data = await response.json();
      setOverviewData(data.data);
    }
  };

  useEffect(() => {
    handleFetchOverview();
  });

  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <div className="flex-1 space-y-4 mt-2">
      <div className="flex items-center justify-between space-y-2 md:space-y-0 md:flex-row flex-col">
        <div className="flex items-center space-x-2">
          <Avatar className="h-24 w-24 aspect-square">
            <AvatarImage
              className="aspect-square"
              src={currentUser.user_photo}
            />
            <AvatarFallback>
              {currentUser.firstname[0] + currentUser.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {`${getGreeting()} ${currentUser.firstname}`}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              How are you today? 😊
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Tabs defaultValue="products" className="space-y-4 bg-white">
            <TabsList className="flex space-x-4 bg-white p-1 rounded-lg border border-gray-200">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 rounded-xl  border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <Wallet className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Expenditure
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                $ {overviewData?.TotalExpenditure || 0}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Image
              src="/assets/images/3dicons.png"
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-emerald-600">
              {overviewData?.pendingOrder || 0} Pending Transaction
            </span>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-purple-50 p-4">
              <ShoppingBag className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Delivered Products
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {overviewData?.completeOrder || 0}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Image
              src="/assets/images/3dicons.png"
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-purple-600">
              {overviewData?.orderInProgress || 0} Pending Order
            </span>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-orange-50 p-4">
              <History className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Products In Transit
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {" "}
                {overviewData?.orderInProgress || 0}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Image
              src="/assets/images/3dicons.png"
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-red-600">
              {overviewData?.cancelleOrder || 0} Cancelled Products
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
