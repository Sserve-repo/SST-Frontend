"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignOverview } from "./campaign-overview"
import { CampaignPerformanceView } from "./campaign-performance-view"
import type { Campaign } from "@/types/marketing"

interface CampaignDetailsDialogProps {
  campaign: Campaign | null
  onOpenChange: (open: boolean) => void
}

export function CampaignDetailsDialog({ campaign, onOpenChange }: CampaignDetailsDialogProps) {
  if (!campaign) return null

  return (
    <Dialog open={!!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <CampaignOverview campaign={campaign} />
          </TabsContent>
          <TabsContent value="performance">
            <CampaignPerformanceView campaign={campaign} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

