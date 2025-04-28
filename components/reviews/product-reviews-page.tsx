"use client";

import { useEffect, useState } from "react";
import { ReviewOverview, ReviewStats } from "@/components/reviews/stats";
import { ReviewSort } from "@/components/reviews/sort";
import type { Review } from "@/types/reviews";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerReviews,
  replyCustomerReview,
} from "@/actions/dashboard/vendors";
import { ProductReviewList } from "./product-list";

export default function ServiceReviewsPage({ product }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewOverview, setReviewOverview] = useState<ReviewOverview>({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {},
  });

  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");
  const { toast } = useToast();

  const handleFetchReview = async () => {
    try {
      const response = await getCustomerReviews(product?.id);
      const data = await response?.json();

      const transformedData = data?.data?.reviews?.map((item: any) => {
        return {
          id: item.id,
          customerName: item.customer_name,
          comment: item.comment,
          rating: item.rating,
          customerAvatar: item.customer_photo,
          date: new Date("2024-02-20"),
          reply: null,
          status: "visible",
        };
      });
      setReviews(transformedData || []);
      setReviewOverview({
        averageRating: data?.data?.ratings_overview?.averageRating,
        totalReviews: data?.data?.ratings_overview?.totalReviews,
        ratingCounts: data?.data?.ratings_overview?.ratingCounts,
      } as any);
      console.log({ reviewData: transformedData });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReply = async (reviewId: string, replyText: string) => {
    if (!replyText) {
      toast({
        title: "Error",
        description: "Please enter a response before submitting.",
        variant: "destructive",
      });
      return;
    }

    const form = new FormData();
    form.append("comment", replyText);

    const response = await replyCustomerReview(form, parseInt(reviewId));
    const data = await response?.json();

    if (data?.status !== "success") {
      toast({
        title: "Error",
        description: "Failed to post your response. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const review = data.data.reviews;
    setReviews((prev) => [
      ...prev,
      {
        id: review?.id,
        customerName: review?.customer_name,
        comment: review?.comment,
        rating: review?.rating,
        customerAvatar: review?.customer_photo,
        date: new Date("2024-02-20"),
        reply: null,
        status: "visible",
      },
    ]);

    toast({
      title: "Reply posted",
      description: "Your response has been posted successfully.",
    });
  };

  const handleReport = (reviewId: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            status: "hidden",
          };
        }
        return review;
      })
    );

    toast({
      title: "Review reported",
      description: "The review has been hidden and reported for review.",
      variant: "destructive",
    });
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "latest") {
      return b.date.getTime() - a.date.getTime();
    }
    return b.rating - a.rating;
  });

  const visibleReviews = sortedReviews.filter(
    (review) => review.status === "visible"
  );

  useEffect(() => {
    handleFetchReview();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Customer Reviews</h1>
        <p className="text-gray-500">
          Manage and respond to your customer reviews
        </p>
      </div>

      <ReviewStats reviews={reviews} reviewOverview={reviewOverview} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {visibleReviews.length} reviews
        </p>
        <ReviewSort value={sortBy} onValueChange={setSortBy} />
      </div>

      <ProductReviewList
        reviews={visibleReviews}
        onReply={handleReply}
        onReport={handleReport}
        productId={product.id}
      />
    </div>
  );
}
