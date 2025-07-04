"use client";

import { useCallback, useEffect, useState } from "react";
import { ReviewOverview, ReviewStats } from "@/components/reviews/stats";
import { ReviewSort } from "@/components/reviews/sort";
import type { Review } from "@/types/reviews";
import { toast } from "sonner";

import {
  getCustomerReviews,
  replyCustomerReview,
} from "@/actions/dashboard/artisans";
import { ServiceReviewList } from "./service-list";
import { ReplyForm, ReviewCard } from "./utils";
import {
  addServiceReview,
  getServiceReviews,
  getServiceReviewsReplies,
} from "@/actions/service";
import { Progress } from "@radix-ui/react-progress";
import { Star } from "lucide-react";

type ReviewData = {
  id: string;
  avatar: string;
  username: string;
  productId?: number;
  comment: string;
  rating: number;
};

export default function ServiceReviewsPage({ service }) {
  const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);
  const [reviewOverview, setReviewOverview] = useState<number | null>(null);

  const [reviewFormData, setReviewFormData] = useState<{
    review: string;
    rating: number;
  }>({ review: "", rating: 0 });

  const [reviewRepliesData, setReviewRepliesData] = useState<ReviewData>({
    id: "",
    username: "Vendor",
    productId: 1,
    comment: "",
    rating: 0,
    avatar: "https://i.pravatar.cc/40?img=1",
  });
  const [replies, setReplies] = useState({
    0: [{ text: "Reply 1" }],
    1: [],
    2: [],
  });
  const rating = 4.5;

  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");

  // const handleFetchReview = useCallback(async () => {
  //   try {
  //     const response = await getCustomerReviews(service?.id);
  //     const data = await response?.json();

  //     const transformedData = data?.data?.reviews?.map((item: any) => {
  //       return {
  //         id: item.id,
  //         customerName: item.customer_name,
  //         comment: item.comment,
  //         rating: item.rating,
  //         customerAvatar: item.customer_photo,
  //         date: new Date("2024-02-20"),
  //         reply: null,
  //         status: "visible",
  //       };
  //     });
  //     setReviews(transformedData || []);
  //     setReviewOverview({
  //       averageRating: data?.data?.ratings_overview?.averageRating,
  //       totalReviews: data?.data?.ratings_overview?.totalReviews,
  //       ratingCounts: data?.data?.ratings_overview?.ratingCounts,
  //     } as any);
  //     console.log({ reviewData: transformedData });
  //   } catch (error) {
  //     console.error("Error fetching reviews:", error);
  //   }
  // }, [service?.id]);

  const handleReply = async (reviewId: string, replyText: string) => {
    if (!replyText) {
      toast("Please enter a response before submitting");
      return;
    }

    const form = new FormData();
    form.append("comment", replyText);

    const response = await replyCustomerReview(form, parseInt(reviewId));
    const data = await response?.json();

    if (data?.status !== "success") {
      toast("Failed to post your response. Please try again");
      return;
    }

    const rev = data.data.reviews;
    setReviewFormData({ review: "", rating: 0 });
    setActiveReplyIndex(null);

    setReplies(replies);
    setReviewsData((prev) => [
      {
        id: rev?.id,
        avatar: data?.data?.user?.avatar,
        username: data?.data?.user.username || "Anonymous",
        comment: rev?.comment,
        rating: rev?.rating,
      },
      ...prev,
    ]);

    toast("Reply sent...");
  };

  const handleSubmitReply = async () => {
    try {
      if (!reviewFormData.review) {
        toast.error("Please enter a review");
        return;
      }
      if (reviewFormData.rating === 0) {
        toast.error("Please select a rating");
        return;
      }

      const form = new FormData();
      form.append("comment", reviewFormData.review);
      form.append("rating", reviewFormData.rating.toString());

      const response = await addServiceReview(
        form,
        service!["Service Details"]?.id
      );
      const data = await response?.json();
      if (data?.status === true) {
        const rev = data.data.reviews;
        // setFormData({ review: "", rating: 0 });
        setActiveReplyIndex(null);

        setReplies(replies);
        setReviewsData((prev) => [
          {
            id: rev?.id,
            avatar: data?.data?.user?.avatar,
            username: data?.data?.user.username || "Anonymous",
            comment: rev?.comment,
            rating: rev?.rating,
          },
          ...prev,
        ]);
        toast.success("Review added successfully");
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to submit reply");
    }
  };

  const handleFetchReviewReplies = async (
    productId: number,
    reviewId: number
  ) => {
    try {
      if (activeReplyIndex === reviewId) {
        setActiveReplyIndex(null);
      } else {
        setActiveReplyIndex(reviewId);

        // Optionally: fetch replies here
        const response = await getServiceReviewsReplies(productId, reviewId);
        const data = await response?.json();

        setReviewRepliesData((prev) => ({
          ...prev,
          comment: data?.data?.reviews?.comment,
        }));
        //         setReviewOverview({
        //   averageRating: data?.data?.ratings_overview?.averageRating,
        //   totalReviews: data?.data?.ratings_overview?.totalReviews,
        //   ratingCounts: data?.data?.ratings_overview?.ratingCounts,
        // } as any);
        // setReviewsData((prev) => [
        //   ...prev,
        //   {
        //     id: review?.id,
        //     customerName: review?.customer_name,
        //     comment: review?.comment,
        //     rating: review?.rating,
        //     customerAvatar: review?.customer_photo,
        //     date: new Date("2024-02-20"),
        //     reply: null,
        //     status: "visible",
        //   },
        // ]);
      }
    } catch (error) {
      console.error("Error fetching review replies:", error);
    }
  };

  const handleFetchReview = useCallback(async (serviceId: number) => {
    try {
      const response = await getServiceReviews(serviceId);
      const data = await response?.json();
      const transformedData = data?.data?.reviews?.map((item: any) => ({
        id: item.id,
        username: item.customer_name,
        comment: item.comment,
        rating: item.rating,
        avatar: item.customer_photo,
      }));
      setReviewsData(transformedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, []);

  const handleReport = (reviewId: string) => {
    // setReviews(
    //   reviews.map((review) => {
    //     if (review.id === reviewId) {
    //       return {
    //         ...review,
    //         status: "hidden",
    //       };
    //     }
    //     return review;
    //   })
    // );
    // toast({
    //   title: "Review reported",
    //   description: "The review has been hidden and reported for review.",
    //   variant: "destructive",
    // });
  };

  useEffect(() => {
    // handleFetchReview(artisanId);
  }, [handleFetchReview]);

  return (
    <div className="p-6 space-y-6">
      <div className="md:mt-8 mt-16">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold mr-2">{rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">Based on {6} reviews</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="text-sm text-gray-600 w-2">{star}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current mx-1" />
                <Progress value={Math.random() * 100} className="h-2 flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {reviewsData?.length > 0 ? (
            reviewsData?.map((item: any, i) => (
              <div key={i} className="border-t pt-6">
                <ReviewCard
                  avatar={item?.avatar}
                  username={item?.username}
                  rating={item?.rating}
                  comment={item?.comment}
                />

                <div className="flex gap-4 mt-2">
                  <p
                    onClick={() => handleFetchReviewReplies(2, item?.id)}
                    className="cursor-pointer text-sm text-blue-500"
                  >
                    {activeReplyIndex === parseInt(item?.id)
                      ? "Hide Replies"
                      : "See Replies"}
                  </p>
                </div>

                {activeReplyIndex === parseInt(item?.id) && (
                  <div className="mt-4 ml-8 space-y-4">
                    {reviewRepliesData && reviewRepliesData.comment ? (
                      <ReviewCard
                        // key={j}
                        avatar={reviewRepliesData.avatar}
                        username={reviewRepliesData.username}
                        comment={reviewRepliesData.comment}
                        showRating={true}
                      />
                    ) : (
                      <p className="text-sm text-gray-400">
                        No replies yet. Be the first to reply.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No Reviews</p>
          )}
        </div>

        <ReplyForm
          onSubmit={() => handleSubmitReply()}
          setFormData={setReviewFormData}
          formData={reviewFormData}
        />
      </div>

      <ReviewStats reviews={reviewsData} reviewOverview={reviewOverview} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {visibleReviews.length} reviews
        </p>
        <ReviewSort value={sortBy} onValueChange={setSortBy} />
      </div>

      <ServiceReviewList
        reviews={visibleReviews}
        onReply={handleReply}
        onReport={handleReport}
        serviceId={service.id}
      />
    </div>
  );
}
