"use client";

import { useCallback, useEffect, useState } from "react";
import { type ReviewOverview, ReviewStats } from "@/components/reviews/stats";
import { ReviewSort } from "@/components/reviews/sort";
import type { Review } from "@/types/reviews";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerReviews,
  replyCustomerReview,
} from "@/actions/dashboard/vendors";
import { ProductReviewList } from "./product-list";

interface ProductReviewsPageProps {
  product: any;
}

export default function ProductReviewsPage({
  product,
}: ProductReviewsPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewOverview, setReviewOverview] = useState<ReviewOverview>({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {},
  });
  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");
  const { toast } = useToast();

  const handleFetchReview = useCallback(async () => {
    if (!product?.id) return;

    try {
      const response = await getCustomerReviews(product.id);
      if (!response?.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      const transformedData =
        data?.data?.reviews?.map((item: any) => ({
          id: item.id,
          customerName:
            item.user?.firstname + " " + (item.user?.lastname || ""),
          comment: item.comment,
          rating: item.rating,
          customerAvatar: item.user?.profile_photo || "/placeholder.svg",
          date: new Date(item.created_at || "2024-02-20"),
          reply: null,
          status: "visible",
        })) || [];

      setReviews(transformedData);
      setReviewOverview({
        averageRating: data?.data?.ratings_overview?.averageRating || 0,
        totalReviews:
          data?.data?.ratings_overview?.totalReviews || transformedData.length,
        ratingCounts: data?.data?.ratings_overview?.ratingCounts || {},
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    }
  }, [product?.id, toast]);

  const handleReply = async (reviewId: string, replyText: string) => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const form = new FormData();
      form.append("comment", replyText.trim());

      const response = await replyCustomerReview(
        form,
        Number.parseInt(reviewId)
      );
      if (!response?.ok) {
        throw new Error("Failed to post reply");
      }

      const data = await response.json();
      if (!data?.status) {
        throw new Error(data?.message || "Failed to post reply");
      }

      toast({
        title: "Reply posted",
        description: "Your response has been posted successfully.",
      });

      // Refresh reviews to show the new reply
      handleFetchReview();
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post your response. Please try again.",
        variant: "destructive",
      });
    }
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
  }, [handleFetchReview]);

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
