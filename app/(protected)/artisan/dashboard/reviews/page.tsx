"use client"

import { useState } from "react"
import { ReviewStats } from "@/app/(protected)/artisan/dashboard/components/reviews/stats"
import { ReviewList } from "@/app/(protected)/artisan/dashboard/components/reviews/list"
import { ReviewSort } from "@/app/(protected)/artisan/dashboard/components/reviews/sort"
import { useToast } from "@/components/ui/toast"
import type { Review } from "@/types/reviews"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "Sarah Johnson",
      customerAvatar: "/placeholder.svg",
      rating: 5,
      comment: "Amazing service! Very professional and the results were exactly what I wanted.",
      date: new Date("2024-02-20"),
      serviceId: "1",
      serviceName: "Haircut & Styling",
      reply: null,
      status: "visible",
    },
    {
      id: "2",
      customerName: "Michael Brown",
      customerAvatar: "/placeholder.svg",
      rating: 4,
      comment: "Good service but had to wait a bit longer than expected.",
      date: new Date("2024-02-19"),
      serviceId: "2",
      serviceName: "Hair Coloring",
      reply: {
        text: "Thank you for your feedback! We're working on improving our scheduling system.",
        date: new Date("2024-02-19"),
      },
      status: "visible",
    },
    {
      id: "3",
      customerName: "Emily Davis",
      customerAvatar: "/placeholder.svg",
      rating: 3,
      comment: "Service was okay but could be better.",
      date: new Date("2024-02-18"),
      serviceId: "1",
      serviceName: "Haircut & Styling",
      reply: null,
      status: "visible",
    },
  ])

  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest")
  const { toast } = useToast()

  const handleReply = (reviewId: string, replyText: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            reply: {
              text: replyText,
              date: new Date(),
            },
          }
        }
        return review
      }),
    )

    toast({
      title: "Reply posted",
      description: "Your response has been posted successfully.",
    })
  }

  const handleReport = (reviewId: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            status: "hidden",
          }
        }
        return review
      }),
    )

    toast({
      title: "Review reported",
      description: "The review has been hidden and reported for review.",
      variant: "destructive",
    })
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "latest") {
      return b.date.getTime() - a.date.getTime()
    }
    return b.rating - a.rating
  })

  const visibleReviews = sortedReviews.filter((review) => review.status === "visible")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#5D3A8B]">Customer Reviews</h1>
        <p className="text-gray-500">Manage and respond to your customer reviews</p>
      </div>

      <ReviewStats reviews={reviews} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing {visibleReviews.length} reviews</p>
        <ReviewSort value={sortBy} onValueChange={setSortBy} />
      </div>

      <ReviewList reviews={visibleReviews} onReply={handleReply} onReport={handleReport} />
    </div>
  )
}

