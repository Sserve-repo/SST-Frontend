import { Metadata } from "next";
import { Overview } from "@/components/dashboard/overview";
import { TransactionList } from "@/components/dashboard/transaction-listing";
import { Messages } from "@/components/dashboard/message";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <div className="space-y-6 px-4 py-2">
        <div className="">
          <Overview />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-8">
          <TransactionList className="sm:col-span-1 md:col-span-1 lg:col-span-5 " />
          <Messages className="sm:col-span-1 md:col-span-1 lg:col-span-3" />
        </div>
      </div>
    </>
  );
}
