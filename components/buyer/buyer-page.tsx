"use client";

import { Overview } from "@/components/dashboard/overview";
import {
  TransactionList,
  TransactionType,
} from "@/components/dashboard/transaction-listing";
import { Messages } from "@/components/dashboard/message";
import { useEffect, useState } from "react";
import { getServiceOverview, getProductOverview } from "@/actions/dashboard";

type OverviewType = {
  Transactions: TransactionType[];
  TotalExpenditure: string;
  orderInProgress: string;
  cancelleOrder: string;
  pendingOrder: string;
  completeOrder: string;
};

export default function BuyerPage() {
  const [tab, setTab] = useState("products");
  const [overviewData, setOverviewData] = useState<OverviewType | null>(null);

  const handleFetchProductOverview = async () => {
    const response = await getProductOverview();
    if (response && response.ok) {
      const data = await response.json();
      setOverviewData(data.data);
    }
  };

  const handleFetchServiceOverview = async () => {
    const response = await getServiceOverview();
    if (response && response.ok) {
      const data = await response.json();
      setOverviewData(data.data);
    }
  };

  useEffect(() => {
    if (tab === "products") {
      handleFetchProductOverview();
    } else {
      handleFetchServiceOverview();
    }
  }, [tab]);

  return (
    <>
      <div className="space-y-6 px-4 py-2">
        <div className="">
          <Overview overview={overviewData} setTab={setTab} tab={tab} />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-9">
          <TransactionList
            overview={overviewData}
            setTab={setTab}
            tab={tab}
            className="sm:col-span-1 md:col-span-1 lg:col-span-6 "
          />
          <Messages className="sm:col-span-1 md:col-span-1 lg:col-span-3" />
        </div>
      </div>
    </>
  );
}