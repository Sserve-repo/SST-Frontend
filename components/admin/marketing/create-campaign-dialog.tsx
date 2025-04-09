"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CampaignForm } from "./campaign-form"
import type { Campaign } from "@/types/marketing"

interface CreateCampaignDialogProps {
  children: React.ReactNode
}

export function CreateCampaignDialog({ children }: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Omit<Campaign, "id" | "performance" | "createdAt">) => {
    // Handle campaign creation here
    console.log("Creating campaign:", data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <CampaignForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

