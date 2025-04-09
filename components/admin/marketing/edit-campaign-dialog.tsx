"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CampaignForm } from "./campaign-form"
import type { Campaign } from "@/types/marketing"

interface EditCampaignDialogProps {
  campaign: Campaign | null
  onOpenChange: (open: boolean) => void
}

export function EditCampaignDialog({ campaign, onOpenChange }: EditCampaignDialogProps) {
  if (!campaign) return null

  const handleSubmit = (data: Omit<Campaign, "id" | "performance" | "createdAt">) => {
    // Handle campaign update here
    console.log("Updating campaign:", { ...data, id: campaign.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <CampaignForm campaign={campaign} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

