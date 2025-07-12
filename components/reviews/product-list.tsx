"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Star,
  Flag,
  ChevronDown,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/types/reviews";
import { getCustomerReviewsReply } from "@/actions/dashboard/vendors";

interface ProductReviewListProps {
  reviews: Review[];
  productId: number;
  onReply: (reviewId: string, replyText: string) => void;
  onReport: (reviewId: string) => void;
}

type ReviewData = {
  id: string;
  avatar: string;
  username: string;
  comment: string;
};

export function ProductReviewList({
  reviews,
  onReply,
  onReport,
  productId,
}: ProductReviewListProps) {
  const [reviewToReport, setReviewToReport] = useState<Review | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReplies, setSubmittingReplies] = useState<
    Record<string, boolean>
  >({});
  const [reviewRepliesData, setReviewRepliesData] = useState<
    Record<string, ReviewData>
  >({});

  const handleFetchReviewReplies = async (
    productId: number,
    reviewId: number
  ) => {
    try {
      const reviewIdStr = reviewId.toString();

      if (expandedReplies[reviewIdStr]) {
        setExpandedReplies((prev) => ({ ...prev, [reviewIdStr]: false }));
      } else {
        setExpandedReplies((prev) => ({ ...prev, [reviewIdStr]: true }));

        // Fetch replies if not already loaded
        if (!reviewRepliesData[reviewIdStr]) {
          const response = await getCustomerReviewsReply(productId, reviewId);
          if (response?.ok) {
            const data = await response.json();
            setReviewRepliesData((prev) => ({
              ...prev,
              [reviewIdStr]: {
                id: reviewIdStr,
                username: "Vendor",
                comment: data?.data?.reviews?.comment || "No reply available",
                avatar: "https://i.pravatar.cc/40?img=1",
              },
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching review replies:", error);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    const replyText = replyTexts[reviewId]?.trim();
    if (!replyText) return;

    setSubmittingReplies((prev) => ({ ...prev, [reviewId]: true }));

    try {
      await onReply(reviewId, replyText);
      setReplyTexts((prev) => ({ ...prev, [reviewId]: "" }));
      setExpandedReplies((prev) => ({ ...prev, [reviewId]: false }));
    } finally {
      setSubmittingReplies((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

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
                      <AvatarImage
                        src={review.customerAvatar || "/placeholder.svg"}
                      />
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
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReviewToReport(review)}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700">{review.comment}</p>

                {/* Reply Section */}
                <div className="space-y-3">
                  {/* Show existing replies */}
                  <Collapsible
                    open={expandedReplies[review.id] || false}
                    onOpenChange={() =>
                      handleFetchReviewReplies(
                        productId,
                        Number.parseInt(review.id)
                      )
                    }
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                      >
                        {expandedReplies[review.id] ? (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Hide Replies
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-4 w-4 mr-1" />
                            See Replies
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      {reviewRepliesData[review.id] && (
                        <div className="ml-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  reviewRepliesData[review.id].avatar ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback className="bg-purple-600 text-white text-xs">
                                V
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-purple-700">
                              Vendor Reply
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 ml-8">
                            {reviewRepliesData[review.id].comment}
                          </p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Reply Form */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your reply to this review..."
                      value={replyTexts[review.id] || ""}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [review.id]: e.target.value,
                        }))
                      }
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReplySubmit(review.id)}
                        disabled={
                          submittingReplies[review.id] ||
                          !replyTexts[review.id]?.trim()
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {submittingReplies[review.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Post Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Dialog */}
      {reviewToReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Review</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to report this review? This action will hide
              the review and flag it for moderation.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setReviewToReport(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onReport(reviewToReport.id);
                  setReviewToReport(null);
                }}
              >
                Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
