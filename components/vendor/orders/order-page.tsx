"use client";

import { Suspense, useEffect, useState } from "react";
import { OrdersHeader } from "./header";
import { OrdersOverview } from "./overview";
import { OrdersTable } from "./table";
import { OrdersTableSkeleton } from "./table-skeleton";
import { SalesAnalytics } from "./sales-analytics";
import { getOrders } from "@/actions/dashboard/vendors";

export default function OrdersPage() {
  const [orders, setOrders] = useState<[]>([]);
  const [overview, setOverview] = useState({});
  const [analytics, setAnalytics] = useState({});

  const handleFetchOrders = async () => {
    try {
      const response = await getOrders();
      if (!response?.ok) {
        throw Error("Error fetching promotions");
      }

      const data = await response.json();
      console.log({ data });
      const { Analytics, Orders, ...Overview } = data.data;
      setOrders;
      setAnalytics({ ...Analytics });
      setOverview({ ...Overview });

      const transformedOrders = data?.data?.productDiscount.map((pd) => {
        return {
          id: pd.id,
          code: pd?.discount_name?.toUpperCase(),
          type: pd?.discount_type?.toLowerCase(),
          value: pd.discount_value,
          serviceName: pd.discount_name,
          startDate: pd.start_date,
          endDate: pd.end_date,
          status: pd?.status?.toLowerCase(),
          usageLimit: pd?.usage_limit,
          usageCount: pd?.usage_limit,
          description: pd.description,
        };
      });

      setOrders(transformedOrders || []);
    } catch (error) {
      console.error("internal server error occured.", error);
    }
  };

  useEffect(() => {
    handleFetchOrders();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <OrdersHeader />
      <OrdersOverview overview={overview} />
      <div className="grid gap-6 md:grid-cols-9">
        <div className="md:col-span-6">
          <Suspense fallback={<OrdersTableSkeleton />}>
            <OrdersTable orders={orders} />
          </Suspense>
        </div>
        <div className="md:col-span-3">
          <SalesAnalytics analytics={analytics} />
        </div>
      </div>
    </div>
  );
}
