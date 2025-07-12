"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Star, Send, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerReviews,
  replyCustomerReview,
} from "@/actions/dashboard/artisans";
import type { Service } from "@/types/services";

interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  replies?: ReviewReply[];
}

interface ReviewReply {
  id: number;
  comment: string;
  created_at: string;
  user_name: string;
}

interface ServiceReviewPreviewSheetProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceReviewPreviewSheet({
  service,
  open,
  onOpenChange,
}: ServiceReviewPreviewSheetProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!service?.id) return;

    try {
      setLoading(true);
      const response = await getCustomerReviews(Number(service.id));

      if (response?.ok) {
        const data = await response.json();
        if (data.status && data.data?.reviews) {
          const reviewsData = data.data.reviews;
          const transformedReviews: Review[] = reviewsData.map(
            (review: any) => ({
              id: review.id,
              user_name: review.user_name || "Anonymous",
              user_avatar: review.user_avatar,
              rating: Number(review.rating) || 0,
              comment: review.comment || "",
              created_at: review.created_at,
              replies: review.replies || [],
            })
          );
          setReviews(transformedReviews);
        } else {
          setReviews([]);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && service) {
      fetchReviews();
    }
  }, [open, service]);

  const handleReplySubmit = async (reviewId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingReply(true);
      const formData = new FormData();
      formData.append("comment", replyText.trim());

      const response = await replyCustomerReview(formData, reviewId);

      if (response?.ok) {
        const data = await response.json();
        if (data.status) {
          toast({
            title: "Success",
            description: "Reply posted successfully",
          });
          setReplyText("");
          setReplyingTo(null);
          // Refresh reviews to show the new reply
          fetchReviews();
        } else {
          throw new Error(data.message || "Failed to post reply");
        }
      } else {
        throw new Error("Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews for {service.name}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Service Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${service.price} • {service.duration}min
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(averageRating))}
                    <span className="ml-1 font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {reviews.length} reviews
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">
                      Loading reviews...
                    </p>
                  </div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    This service hasn&apos;t received any reviews yet.
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                review.user_avatar ||
                                "/placeholder.svg?height=40&width=40"
                              }
                            />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.user_name}</p>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="ml-1 text-sm text-gray-600">
                                {format(
                                  new Date(review.created_at),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{review.rating}/5</Badge>
                      </div>

                      {/* Review Content */}
                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      {/* Replies */}
                      {review.replies && review.replies.length > 0 && (
                        <div className="ml-6 space-y-2">
                          {review.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-sm">
                                  {reply.user_name}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {format(
                                    new Date(reply.created_at),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {reply.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <Separator className="my-3" />

                      {/* Reply Section */}
                      {replyingTo === review.id ? (
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              disabled={submittingReply}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReplySubmit(review.id)}
                              disabled={submittingReply || !replyText.trim()}
                            >
                              {submittingReply ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Posting...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Post Reply
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(review.id)}
                          className="w-full"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply to Review
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
