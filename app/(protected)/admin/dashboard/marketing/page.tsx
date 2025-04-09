"use client"

import { useState } from "react"
import { CampaignTable } from "@/components/admin/marketing/campaign-table"
import { CampaignStats } from "@/components/admin/marketing/campaign-stats"
import { CampaignFilters } from "@/components/admin/marketing/campaign-filters"
import { CreateCampaignDialog } from "@/components/admin/marketing/create-campaign-dialog"
import { PerformanceCharts } from "@/components/admin/marketing/performance-charts"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
// import type { Campaign } from "@/types/marketing"

export default function MarketingPage() {
  const [campaigns] = useState<any[]>([
    {
      id: "1",
      name: "Summer Sale 2024",
      type: "discount",
      discount: {
        type: "percentage",
        value: 20,
      },
      status: "active",
      targetAudience: ["new_users", "inactive_users"],
      startDate: "2024-06-01T00:00:00",
      endDate: "2024-08-31T23:59:59",
      performance: {
        impressions: 15000,
        clicks: 3750,
        conversions: 450,
        revenue: 22500,
        ctr: 25,
        conversionRate: 12,
      },
      createdAt: "2024-02-15T10:00:00",
    },
    {
      id: "2",
      name: "First Purchase Discount",
      type: "first_purchase",
      discount: {
        type: "fixed",
        value: 50,
      },
      status: "scheduled",
      targetAudience: ["new_users"],
      startDate: "2024-03-01T00:00:00",
      endDate: "2024-12-31T23:59:59",
      performance: null,
      createdAt: "2024-02-20T15:30:00",
    },
    {
      id: "3",
      name: "Flash Sale - 24 Hours Only",
      type: "flash_sale",
      discount: {
        type: "percentage",
        value: 30,
      },
      status: "completed",
      targetAudience: ["all_users"],
      startDate: "2024-02-01T00:00:00",
      endDate: "2024-02-02T00:00:00",
      performance: {
        impressions: 25000,
        clicks: 8750,
        conversions: 875,
        revenue: 43750,
        ctr: 35,
        conversionRate: 10,
      },
      createdAt: "2024-01-25T09:00:00",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Marketing & Promotions</h1>
          <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
        </div>
        <CreateCampaignDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </CreateCampaignDialog>
      </div>

      <CampaignStats campaigns={campaigns} />
      <PerformanceCharts campaigns={campaigns} />
      <CampaignFilters />
      <CampaignTable campaigns={campaigns} />
    </div>
  )
}

