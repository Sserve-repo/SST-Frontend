"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Campaign } from "@/types/marketing"

interface DeleteCampaignDialogProps {
  campaign: Campaign | null
  onOpenChange: (open: boolean) => void
}

export function DeleteCampaignDialog({ campaign, onOpenChange }: DeleteCampaignDialogProps) {
  if (!campaign) return null

  const handleDelete = () => {
    // Handle campaign deletion here
    console.log("Deleting campaign:", campaign.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!campaign} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this campaign? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete Campaign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

