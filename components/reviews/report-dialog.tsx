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
import type { Review } from "@/types/reviews"

interface ReportDialogProps {
  review: Review | null
  onOpenChange: (open: boolean) => void
  onReport: (reviewId: string) => void
}

export function ReportDialog({ review, onOpenChange, onReport }: ReportDialogProps) {
  if (!review) return null

  return (
    <AlertDialog open={!!review} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Report Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to report this review? It will be hidden from your profile and sent for review by our
            team.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onReport(review.id)} className="bg-red-600 hover:bg-red-700">
            Report Review
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

