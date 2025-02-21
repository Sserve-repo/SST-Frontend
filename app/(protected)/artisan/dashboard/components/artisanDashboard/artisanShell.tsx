"use client"
import { StatsCards } from "./stats-card"
import { EarningsSummary } from "./earnings-summary"
import { BookingsCalendar } from "./bookings-calender"
import { RecentActivity } from "./recent-activity"

export function DashboardShell() {
  return (
    <main className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#5D3A8B]">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here is what happening with your business.</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-1 lg:col-span-4">
          <EarningsSummary />
        </div>
        <div className="md:col-span-1 lg:col-span-3">
          <BookingsCalendar />
        </div>
      </div>

      <RecentActivity />
    </main>
  )
}

