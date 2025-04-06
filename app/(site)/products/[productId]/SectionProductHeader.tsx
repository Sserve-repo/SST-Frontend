"use client";
import type { FC } from "react";
import React, { useState } from "react";
import ReactStars from "react-rating-star-with-type";
import { Button } from "@/components/ui/button";
import ImageShowCase from "@/components/ImageShowCase";
import { RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface SectionProductHeaderProps {
  slug: string;
  id: number;
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
    [key: string]: string | string[]; // Specifications as key-value pairs
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

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  // slug,
  id,
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
  const [review, setReview] = useState("");

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
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

  const handleSubmitReview = async () => {
    console.log({ review, rating: 2, userId: 1, productId: 1 });
  };

  console.log(images);
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
                    <Progress
                      value={Math.random() * 100}
                      className="h-2 flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Customer review list */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-t pt-6">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://i.pravatar.cc/40?img=${i + 1}`}
                      />
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-semibold">User {i + 1}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    This chair is amazing! It&apos;s comfortable for long work
                    sessions and has great lumbar support. The adjustable
                    features make it perfect for my home office setup.
                  </p>
                </div>
              ))}
            </div>

            {/* Add Review */}
            <div className="flex flex-col  gap-y-2 my-8">
              <Textarea
                placeholder="Add your review."
                onChange={(e) => setReview(e.target.value)}
              />
              <div className="flex justify-between gap-y-2 mb-8">
                <Button
                  className="w-28"
                  type="button"
                  onClick={handleSubmitReview}
                >
                  Submit
                </Button>
                {/* Reviews and Stars */}
                <div className="flex items-center gap-1">
                  <ReactStars
                    value={4.7}
                    isEdit={true}
                    size={22}
                    activeColors={["#FFCE50"]}
                  />
                  <span className="text-xs text-neutral-500">
                    ({reviews}k) Reviews
                  </span>
                </div>
              </div>
            </div>
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

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Meet Your Seller</h2>
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24 rounded">
                <AvatarImage
                  src={`https://i.pravatar.cc/48?u=${seller.name}`}
                />
                {/* <AvatarFallback>{seller?.name?.slice(0, 2)}</AvatarFallback> */}
              </Avatar>
              <div>
                <p className="font-semibold text-lg hover:underline">
                  {seller.name}
                </p>
                <p className="text-xs text-primary/70">
                  Owner of{" "}
                  <span className="text-primary">Triple Rock POP Cement </span>
                </p>
                {/* <div className="flex items-center">
                  <HeartIcon className="h-4 w-4 text-orange-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    Followed
                  </span>
                </div> */}
                <Button className="text-xs px-5 w-48 mt-1" variant={"outline"}>
                  Message Seller
                </Button>
              </div>
            </div>
            {/* <div className="mt-2 flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{seller.location}</span>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionProductHeader;
