import { Star } from "lucide-react";

export const RatingCard = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, j) => (
        <Star
          key={j}
          className={`h-4 w-4 ${
            j < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
