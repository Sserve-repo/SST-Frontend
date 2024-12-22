import { Star } from "lucide-react";

interface ReviewCardProps {
  author: string;
  date: string;
  rating: number;
  content: string;
}

export function ReviewCard({ author, date, rating, content }: ReviewCardProps) {
  return (
    <div className="border-b py-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">{author}</span>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
      <div className="my-2 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-sm">{content}</p>
    </div>
  );
}
