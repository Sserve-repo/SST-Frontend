"use client";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-star-with-type";
import { Button } from "@/components/ui/button";
import ImageShowCase from "@/components/ImageShowCase";
import {
  MessageCircle,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import {
  addProductReview,
  getProductReviews,
  getProductReviewsReplies,
} from "@/actions/product";
import { ReplyForm, ReviewCard } from "@/components/reviews/utils";
import { createMessage } from "@/actions/dashboard/vendors";
import { MessageInitiationModal } from "@/components/messages/message-initiation-modal";

interface SectionProductHeaderProps {
  slug: string;
  id: number;
  userId: number;
  productName: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  images: string[];
  features: string[];
  specifications: {
    [key: string]: string | string[];
  };
  seller: {
    name: string;
    rating: number;
    totalSales: number;
    joinedDate: string;
    location: string;
  };
  estimatedDelivery: string;
  returnPolicy: string;
}

type ReviewData = {
  id: string;
  avatar: string;
  username: string;
  productId?: number;
  comment: string;
  rating: number;
};

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  // slug,
  id,
  userId,
  productName,
  description,
  price,
  discountedPrice,
  discount,
  rating,
  reviews,
  images,
  seller,
  estimatedDelivery,
  returnPolicy,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);
  const [message, setMessage] = useState("");
  const [reviewRepliesData, setReviewRepliesData] = useState<ReviewData>({
    id: "",
    username: "Vendor",
    productId: id,
    comment: "",
    rating: 0,
    avatar: "https://i.pravatar.cc/40?img=1",
  });

  const [formData, setFormData] = useState<{
    review: string;
    rating: number;
  }>({ review: "", rating: 0 });

  const [replies, setReplies] = useState({
    0: [{ text: "Reply 1" }],
    1: [],
    2: [],
  });

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleSubmitReply = async () => {
    try {
      if (!formData.review) {
        toast.error("Please enter a review");
        return;
      }
      if (formData.rating === 0) {
        toast.error("Please select a rating");
        return;
      }

      const form = new FormData();
      form.append("comment", formData.review);
      form.append("rating", formData.rating.toString());

      const response = await addProductReview(form, id);
      const data = await response?.json();
      if (data?.status === true) {
        const rev = data.data.reviews;
        setFormData({ review: "", rating: 0 });
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

  const handleMessageSeller = async (e) => {
    e.preventDefault();
    try {
      if (!message) {
        toast.error("Please enter a message");
        return;
      }

      const form = new FormData();
      form.append("recipient_id", userId.toString());
      form.append("message", message);

      const response = await createMessage(form);
      const data = await response?.json();
      if (data?.status === true) {
        setMessage("");
        toast.success("Message added successfully");
      } else {
        toast.error("Failed to add Message");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to submit reply");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      unit_price: price.toString(),
      quantity,
      product_id: id,
      title: productName,
      image: images[0],
    });
    toast.success(`Added ${quantity} ${productName} to cart`);
  };

  const handleFetchReview = async (productId: number) => {
    try {
      const response = await getProductReviews(productId);
      const data = await response?.json();

      const transformedData = data?.data?.reviews?.map((item: any) => {
        return {
          id: item.id,
          username: item.customer_name,
          comment: item.comment,
          rating: item.rating,
          avatar: item.customer_photo,
        };
      });
      setReviewsData(transformedData);

      console.log({ reviewData: transformedData });
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
        const response = await getProductReviewsReplies(productId, reviewId);
        const data = await response?.json();

        setReviewRepliesData((prev) => ({
          ...prev,
          comment: data?.data?.reviews?.comment,
        }));
      }
    } catch (error) {
      console.error("Error fetching review replies:", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    handleFetchReview(id);
  }, [id]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 space-y-10 md:space-y-0">
        <div className="space-y-10 md:col-span-7">
          <ImageShowCase shots={images} />
          <div className="space-y-5 self-start block md:hidden">
            <div className="space-y-2">
              <h1 className="mb-0 text-4xl font-medium">{productName}</h1>
              <p className="text-base text-neutral-500">{description}</p>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${price}</span>
              <span className="text-lg text-gray-500 line-through">
                ${price}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {discount}% OFF
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="px-3 py-1 text-lg text-gray-800">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <Button className="flex-1 py-3 h-12 " onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>2-year warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="h-4 w-4" />
                <span>{returnPolicy}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Estimated Delivery</h2>
              <p className="text-gray-600">{estimatedDelivery}</p>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Meet Your Seller</h2>
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 rounded">
                  <AvatarImage
                    src={`https://i.pravatar.cc/48?u=${seller.name}`}
                  />
                  <AvatarFallback>{seller?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg hover:underline">
                    {seller.name}
                  </p>
                  <p className="text-xs text-primary/70">
                    Owner of{" "}
                    <span className="text-primary">
                      Triple Rock POP Cement{" "}
                    </span>
                  </p>

                  <textarea></textarea>
                  <Button
                    className="text-xs px-5 w-48 mt-1"
                    variant={"outline"}
                  >
                    Message Seller
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
                <p className="text-sm text-gray-600">
                  Based on {reviews} reviews
                </p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center">
                    <span className="text-sm text-gray-600 w-2">{star}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current mx-1" />
                    <Progress value={rating * 100} className="h-2 flex-1" />
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
                        onClick={() => handleFetchReviewReplies(id, item?.id)}
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
              setFormData={setFormData}
              formData={formData}
            />
          </div>
        </div>

        <div className="md:sticky md:col-span-5 md:top-28 space-y-5 self-start hidden md:block">
          <div className="space-y-2">
            <h1 className="mb-0 text-4xl font-medium">{productName}</h1>
            <p className="text-base text-neutral-500">{description}</p>
          </div>

          {/* Reviews and Stars */}
          <div className="flex items-center gap-1">
            <ReactStars
              value={4.7}
              isEdit={true}
              size={15}
              activeColors={["#FFCE50"]}
            />
            <span className="text-xs text-neutral-500">
              ({reviews}k) Reviews
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-lg text-gray-500 line-through">
              ${discountedPrice}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {discount}% OFF
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="px-3 py-1 text-lg text-gray-800">
                {quantity}
              </span>
              <button
                className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <Button className="flex-1 py-3 h-12 " onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            {/* <Button variant="outline">
              <Heart className="h-4 w-4" />
            </Button> */}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>2-year warranty</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RotateCcw className="h-4 w-4" />
              <span>{returnPolicy}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Estimated Delivery</h2>
            <p className="text-gray-600">{estimatedDelivery}</p>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h2 className="text-lg font-semibold mb-2">Meet Your Seller</h2>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 rounded">
                <AvatarImage
                  src={`https://i.pravatar.cc/48?u=${seller.name}`}
                />
                <AvatarFallback className="text-lg">
                  {seller?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-lg hover:underline">
                  {seller.name}
                </p>
                <p className="text-xs text-primary/70">
                  Owner of{" "}
                  <span className="text-primary font-semibold">
                    {productName}{" "}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Joined: {new Date(seller.joinedDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Location: {seller.location || "Unknown"}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <ReactStars
                    value={seller.rating}
                    isEdit={false}
                    size={15}
                    activeColors={["#FFCE50"]}
                  />
                  <span className="text-xs text-neutral-500">
                    ({seller.totalSales}k) Sales
                  </span>
                </div>
              </div>

              {/* <div>
                <p className="font-semibold text-lg hover:underline">
                  {seller.name}
                </p>
                <p className="text-xs text-primary/70">
                  Owner of{" "}
                  <span className="text-primary font-semibold">
                    {productName}{" "}
                  </span>
                </p>

                <div className="grid grid-col-1">
                  <textarea
                    placeholder="Enter your messsage here"
                    className=" border-2 border-black rounded-lg text-xs h-16 p-2 "
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <Button
                    onClick={handleMessageSeller}
                    className="text-xs px-5 w-48 mt-1 bg-primary text-white"
                    variant={"outline"}
                  >
                    Send
                  </Button>
                </div>
              </div> */}
            </div>
            <MessageInitiationModal
              recipientId={userId}
              recipientName={seller.name || "Vendor"}
              productName={productName}
            >
              <Button className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Seller
              </Button>
            </MessageInitiationModal>
          </div>
        </div>
      </div>
    </>
  );
};
export default SectionProductHeader;
