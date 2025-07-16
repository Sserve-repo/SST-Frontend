"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  user_photo: string;
}

interface LatestReview {
  id: number;
  user_id: number;
  vendor_id: number;
  product_listing_detail_id: number;
  comment: string;
  rating: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  customer: Customer;
}

interface LatestReviewsProps {
  reviews: LatestReview[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export function LatestReviews({ reviews }: LatestReviewsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Latest Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No reviews available</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[30rem] overflow-y-auto">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    {review.customer.user_photo ? (
                      <AvatarImage
                        src={review.customer.user_photo || "/placeholder.svg"}
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {review.customer.firstname.charAt(0)}
                        {review.customer.lastname.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.customer.firstname} {review.customer.lastname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
