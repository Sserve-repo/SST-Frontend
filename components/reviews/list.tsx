"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReplyDialog } from "./reply-dialog"
import { ReportDialog } from "./report-dialog"
import { Star, MessageCircle, Flag } from "lucide-react"
import type { Review } from "@/types/reviews"

interface ReviewListProps {
  reviews: Review[]
  onReply: (reviewId: string, replyText: string) => void
  onReport: (reviewId: string) => void
}

export function ReviewList({ reviews, onReply, onReport }: ReviewListProps) {
  const [reviewToReply, setReviewToReply] = useState<Review | null>(null)
  const [reviewToReport, setReviewToReport] = useState<Review | null>(null)

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={review.customerAvatar} />
                      <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.customerName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500">{review.serviceName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!review.reply && (
                      <Button variant="ghost" size="sm" onClick={() => setReviewToReply(review)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setReviewToReport(review)}>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700">{review.comment}</p>

                {review.reply && (
                  <div className="mt-4 pl-12 border-l-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Your Reply</p>
                        <span className="text-sm text-gray-500">{review.reply.date.toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{review.reply.text}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReplyDialog
        review={reviewToReply}
        onOpenChange={(open) => !open && setReviewToReply(null)}
        onReply={(replyText) => {
          if (reviewToReply) {
            onReply(reviewToReply.id, replyText)
            setReviewToReply(null)
          }
        }}
      />

      <ReportDialog
        review={reviewToReport}
        onOpenChange={(open) => !open && setReviewToReport(null)}
        onReport={(id) => {
          onReport(id)
          setReviewToReport(null)
        }}
      />
    </>
  )
}

