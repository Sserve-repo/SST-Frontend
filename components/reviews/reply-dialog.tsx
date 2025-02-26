"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Review } from "@/types/reviews"

interface ReplyDialogProps {
  review: Review | null
  onOpenChange: (open: boolean) => void
  onReply: (replyText: string) => void
}

export function ReplyDialog({ review, onOpenChange, onReply }: ReplyDialogProps) {
  const [replyText, setReplyText] = useState("")

  if (!review) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyText.trim()) {
      onReply(replyText)
      setReplyText("")
    }
  }

  return (
    <Dialog open={!!review} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Customer Review:</p>
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reply" className="text-sm font-medium">
              Your Reply
            </label>
            <Textarea
              id="reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!replyText.trim()}>
              Post Reply
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

