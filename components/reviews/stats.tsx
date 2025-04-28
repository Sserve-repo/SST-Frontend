import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Review } from "@/types/reviews";

export type ReviewOverview = {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
};
interface ReviewStatsProps {
  reviews: Review[];
  reviewOverview: ReviewOverview;
}

export function ReviewStats({ reviews, reviewOverview }: ReviewStatsProps) {
  const totalReviews = reviewOverview.totalReviews || reviews.length;
  const averageRating =
    reviewOverview.totalReviews ||
    reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

  const rawCounts = (reviewOverview?.ratingCounts || {}) as Record<
    string,
    number
  >;

  const ratingCounts: Record<number, number> = [1, 2, 3, 4, 5].reduce(
    (acc, rating) => {
      acc[rating] = Number(rawCounts[String(rating)] ?? 0);
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Rating Overview</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">
                {reviewOverview?.totalReviews ? averageRating?.toFixed(1) : 0}
              </span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({totalReviews} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-24">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{rating}</span>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${
                        ((ratingCounts[rating] || 0) / totalReviews) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {ratingCounts[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
