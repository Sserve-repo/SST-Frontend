"use client";

import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { getVendorAnalytics } from "@/actions/dashboard/vendors";

const stats = [
  {
    title: "Total Sales",
    value: "$46,231",
    change: "+20.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Active Listings",
    value: "356",
    change: "-3.2%",
    trend: "down",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Revenue",
    value: "$12,234",
    change: "+8.4%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Pending Orders",
    value: "23",
    change: "+12",
    trend: "up",
    icon: ShoppingCart,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Pending Shipments",
    value: "12",
    change: "-5",
    trend: "down",
    icon: Truck,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
];

export function DashboardStats() {
  // const [analytics, setAnalytics] = useState([]);

  const handleFetchAnalytics = async () => {
    try {
      const response = await getVendorAnalytics();
      if (!response?.ok) {
        throw Error("Cannot fetch analytics data");
      }
      const data = await response.json();
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchAnalytics();
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <TooltipProvider key={stat.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
