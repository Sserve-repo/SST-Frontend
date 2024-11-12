"use client";
import type { FC } from "react";
import React, { useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import ReactStars from "react-rating-star-with-type";
import { Button } from "@/components/ui/button";
import ImageShowCase from "@/components/ImageShowCase";
import {
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface SectionProductHeaderProps {
  slug: string;
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
  slug,
  productName,
  description,
  price,
  discountedPrice,
  discount,
  rating,
  reviews,
  images,
  features,
  specifications,
  seller,
  estimatedDelivery,
  returnPolicy,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const relatedProducts = [
    {
      id: 1,
      name: "Adjustable Standing Desk",
      price: 299.99,
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Ergonomic Keyboard",
      price: 79.99,
      rating: 4.3,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Anti-Fatigue Mat",
      price: 39.99,
      rating: 4.6,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Monitor Arm",
      price: 89.99,
      rating: 4.4,
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  console.log(images);
  return (
    <>
      <div className="items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
        <div className="basis-[55%]">
          <ImageShowCase shots={images} />
          <div className="mt-6">
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
          </div>
          {/* <Tabs defaultValue="description" className="mb-12">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="return-policy">Return Policy</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Product Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">
                Technical Specifications
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">{key}</dt>
                    <dd className="mt-2 text-sm text-gray-500">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
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
            </TabsContent>
            <TabsContent value="return-policy" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
              <p className="mb-4">
                We want you to be completely satisfied with your purchase. If
                for any reason you&apos;re not happy with your order, we offer a{" "}
                {returnPolicy}.
              </p>
              <h3 className="text-lg font-semibold mb-2">How to Return</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Contact our customer service team within 30 days of receiving
                  your order.
                </li>
                <li>Obtain a Return Merchandise Authorization (RMA) number.</li>
                <li>
                  Pack the item securely in its original packaging, if possible.
                </li>
                <li>Include the RMA number on the outside of the package.</li>
                <li>
                  Ship the item back to the address provided by our customer
                  service team.
                </li>
              </ol>
              <p className="mt-4">
                Please note that returned items must be in their original
                condition, unused, and with all original tags and packaging.
                Shipping costs for returns are the responsibility of the
                customer unless the return is due to our error.
              </p>
            </TabsContent>
          </Tabs> */}
        </div>

        <div className="basis-[42%] space-y-5">
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
            <span className="text-3xl font-bold">${discountedPrice}</span>
            <span className="text-lg text-gray-500 line-through">${price}</span>
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
            <Button className="flex-1 py-3 h-12 ">
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
        </div>
      </div>

      {/* <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[activeImage]}
                alt={name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ${
                    index === activeImage ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="mt-2 text-gray-600">{description}</p>
            </div>

            <div className="flex items-center space-x-2">
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
              <span className="text-sm text-gray-600">
                ({reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">
                ${discountedPrice}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${product.price}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {product.discount}% OFF
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="px-3 py-1 text-gray-800">{quantity}</span>
                <button
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <Button className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
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
                <span>{product.returnPolicy}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Estimated Delivery</h2>
              <p className="text-gray-600">{product.estimatedDelivery}</p>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Meet Your Seller</h2>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://i.pravatar.cc/48?u=${product.seller.name}`}
                  />
                  <AvatarFallback>
                    {product.seller.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{product.seller.name}</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {product.seller.rating} ({product.seller.totalSales}{" "}
                      sales)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since{" "}
                    {new Date(product.seller.joinedDate).getFullYear()}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{product.seller.location}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-12">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="return-policy">Return Policy</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Product Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              Technical Specifications
            </h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">{key}</dt>
                  <dd className="mt-2 text-sm text-gray-500">{value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold mr-2">
                    {product.rating}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Based on {product.reviews} reviews
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
                    This chair is amazing! It's comfortable for long work
                    sessions and has great lumbar support. The adjustable
                    features make it perfect for my home office setup.
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="return-policy" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
            <p className="mb-4">
              We want you to be completely satisfied with your purchase. If for
              any reason you're not happy with your order, we offer a{" "}
              {product.returnPolicy}.
            </p>
            <h3 className="text-lg font-semibold mb-2">How to Return</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Contact our customer service team within 30 days of receiving
                your order.
              </li>
              <li>Obtain a Return Merchandise Authorization (RMA) number.</li>
              <li>
                Pack the item securely in its original packaging, if possible.
              </li>
              <li>Include the RMA number on the outside of the package.</li>
              <li>
                Ship the item back to the address provided by our customer
                service team.
              </li>
            </ol>
            <p className="mt-4">
              Please note that returned items must be in their original
              condition, unused, and with all original tags and packaging.
              Shipping costs for returns are the responsibility of the customer
              unless the return is due to our error.
            </p>
          </TabsContent>
        </Tabs>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>${product.price}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div> */}
    </>
  );
};

export default SectionProductHeader;
