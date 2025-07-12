"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Star,
  Reply,
  Send,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCustomerReviews,
  replyCustomerReview,
} from "@/actions/dashboard/vendors";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Review {
  id: number;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  comment: string;
  rating: number;
  created_at: string;
  replies?: Review[];
}

interface ProductReviewsCollapseProps {
  product: any;
  isOpen: boolean;
  onToggle: () => void;
}

export function ProductReviewsCollapse({
  product,
  isOpen,
  onToggle,
}: ProductReviewsCollapseProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!product?.id) return;

    try {
      setLoading(true);
      const response = await getCustomerReviews(Number(product.id));

      if (response?.ok) {
        const data = await response.json();
        if (data.status && data.data?.reviews) {
          setReviews(data.data.reviews);
        } else {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
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
        const result = await response.json();
        if (result.status) {
          toast({
            title: "Success",
            description: "Reply posted successfully",
          });
          setReplyText("");
          setReplyingTo(null);
          fetchReviews(); // Refresh reviews to show the new reply
        } else {
          throw new Error(result.message || "Failed to post reply");
        }
      } else {
        const errorData = await response?.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post reply",
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
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  useEffect(() => {
    if (isOpen && product?.id) {
      fetchReviews();
    }
  }, [isOpen, product?.id]);

  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between p-4 h-auto bg-transparent"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Product Reviews</div>
              <div className="text-sm text-muted-foreground">
                {loading
                  ? "Loading..."
                  : `${reviews.length} review${
                      reviews.length !== 1 ? "s" : ""
                    }`}
                {reviews.length > 0 && ` • ${averageRating} ★ average`}
              </div>
            </div>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Customer Reviews</CardTitle>
            {reviews.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(Math.round(Number(averageRating)))}
                  </div>
                  <span className="font-medium">{averageRating} out of 5</span>
                </div>
                <span>•</span>
                <span>
                  {reviews.length} total review{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading reviews...
                </span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <div className="text-lg font-medium text-muted-foreground">
                  No reviews yet
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Reviews will appear here once customers start reviewing your
                  product
                </div>
              </div>
            ) : (
              <>
                {/* Rating Distribution */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Rating Distribution</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div
                        key={rating}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="w-8">{rating} ★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{
                              width:
                                reviews.length > 0
                                  ? `${
                                      (ratingDistribution[
                                        rating as keyof typeof ratingDistribution
                                      ] /
                                        reviews.length) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">
                          {
                            ratingDistribution[
                              rating as keyof typeof ratingDistribution
                            ]
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <ScrollArea className="max-h-[600px]">
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={review.id}>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                              src="/placeholder.svg"
                              alt={review.user?.firstname}
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {review.user?.firstname?.charAt(0) || "U"}
                              {review.user?.lastname?.charAt(0) || ""}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">
                                  {review.user?.firstname}{" "}
                                  {review.user?.lastname}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center">
                                    {renderStars(review.rating)}
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {review.rating}/5
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-700 leading-relaxed">
                              {review.comment}
                            </p>

                            {/* Reply Section */}
                            {replyingTo === review.id ? (
                              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                                <Textarea
                                  placeholder="Write your reply to this review..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="min-h-[80px] resize-none"
                                />
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleReply(review.id)}
                                    disabled={
                                      submittingReply || !replyText.trim()
                                    }
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    {submittingReply ? (
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
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                    disabled={submittingReply}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReplyingTo(review.id)}
                                className="w-fit"
                              >
                                <Reply className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            )}

                            {/* Display existing replies */}
                            {review.replies && review.replies.length > 0 && (
                              <div className="ml-4 space-y-3 border-l-2 border-purple-100 pl-4">
                                {review.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="space-y-2 p-3 bg-purple-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs bg-purple-600 text-white">
                                          V
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="text-xs font-medium text-purple-700">
                                        Vendor Reply
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(
                                          reply.created_at
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700 ml-8 leading-relaxed">
                                      {reply.comment}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {index < reviews.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
