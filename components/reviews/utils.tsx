import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingCard } from "../extras/RatingCard";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import ReactStars from "react-rating-star-with-type";

export type ReviewCardProps = {
  avatar: string;
  username: string;
  rating?: number;
  comment: string;
  showRating?: boolean;
};

export type ReplyFormProps = {
  // onChange: (val: string) => void;
  onSubmit: () => void;
  formData: any;
  setFormData: (data: any) => void;
};

export const ReviewCard = ({
  avatar,
  username,
  rating,
  comment,
  showRating = true,
}: ReviewCardProps) => (
  <div className="flex flex-col items-start gap-4">
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{username && username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex  flex-col">
        <p className="font-semibold">{username}</p>
        {showRating && <RatingCard rating={rating} />}
      </div>
    </div>
    <p className="text-gray-600 mt-1 ">{comment}</p>
  </div>
);

export const ReplyForm = ({
  // onChange,
  onSubmit,
  formData,
  setFormData,
}: ReplyFormProps) => (
  <div className="mt-8 flex-col space-y-2">
    <Textarea
      placeholder="Write a reply..."
      value={formData.review}
      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
    />
    {/* Reviews and Stars */}
    <div className="flex items-center gap-1">
      <span className="text-neutral-500"> Add your ratings</span>
      <ReactStars
        value={formData.rating}
        onChange={(val) => setFormData({ ...formData, rating: val })}
        isEdit={true}
        size={15}
        activeColors={["#FFCE50"]}
      />
    </div>
    <Button className="mt-2" onClick={onSubmit}>
      Submit
    </Button>
  </div>
);
