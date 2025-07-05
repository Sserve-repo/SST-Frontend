"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArtisanProfile } from "@/actions/artisans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, MessageCircle, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
// import { replyCustomerReview } from "@/actions/dashboard/artisans";
import {
  addServiceReview,
  getServiceReviewsReplies,
  getServiceReviews,
} from "@/actions/service";
import { toast } from "sonner";
import { ReplyForm, ReviewCard } from "@/components/reviews/utils";

type ArtisanListing = {
  id: string;
  image: string;
  price: number;
  title: string;
  description: string;
  service_category?: any;
  rating?: number;
  is_favorite?: boolean;
};

type Artisan = {
  id: string;
  firstname: string;
  lastname: string;
  service_category: any;
  service_category_item: any;
  artisan_service_listing: ArtisanListing[];
  artisan_business_details: any;
  artisan_service_area: any;
  artisan_business_policy: any;
};

type ReviewData = {
  id: string;
  avatar: string;
  username: string;
  productId?: number;
  comment: string;
  rating: number;
};

const Service = () => {
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { artisanId } = useParams();
  const router = useRouter();
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);
  const [reviewFormData, setReviewFormData] = useState<{
    review: string;
    rating: number;
  }>({ review: "", rating: 0 });
  const [replies, setReplies] = useState({
    0: [{ text: "Reply 1" }],
    1: [],
    2: [],
  });

  const [reviewRepliesData, setReviewRepliesData] = useState<ReviewData>({
    id: "",
    username: "Vendor",
    productId: 1,
    comment: "",
    rating: 0,
    avatar: "https://i.pravatar.cc/40?img=1",
  });

  const handleFetchArtisanProfile = async (id) => {
    try {
      setLoading(true);
      const response = await getArtisanProfile(id);
      if (response && response.ok) {
        const data = await response.json();
        setArtisan(data.data["Artisan Business profile"]);

        const transformedData = data?.data["Artisan Reviews"]?.map(
          (item: any) => ({
            id: item.id,
            username: item.customer_name,
            comment: item.comment,
            rating: item.rating,
            avatar: item.customer_photo,
          })
        );
        setReviewsData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching artisan profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReview = useCallback(async () => {
    try {
      const response = await getServiceReviews(artisanId as any);
      const data = await response?.json();

      console.log({ data });

      const transformedData = data?.data.reviews.map((item: any) => ({
        id: item.id,
        username: item.customer_name,
        comment: item.comment,
        rating: item.rating,
        avatar: item.customer_photo,
      }));
      setReviewsData(transformedData);

      console.log({ transformedData });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, []);

  const handleBookService = async (serviceId) => {
    router.push(`/booking?serviceId=${serviceId}`);
  };

  const handleMessageArtisan = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/messages/${artisanId}`);
  };

  useEffect(() => {
    if (artisanId) {
      handleFetchArtisanProfile(artisanId);
    }
  }, [artisanId]);

  useEffect(() => {
    handleFetchReview();
  }, [handleFetchReview]);

  // const handleReply = async (reviewId: string, replyText: string) => {
  //   if (!replyText) {
  //     toast("Please enter a response before submitting");
  //     return;
  //   }

  //   const form = new FormData();
  //   form.append("comment", replyText);

  //   const response = await replyCustomerReview(form, parseInt(reviewId));
  //   const data = await response?.json();

  //   if (data?.status !== "success") {
  //     toast("Failed to post your response. Please try again");
  //     return;
  //   }

  //   const rev = data.data.reviews;
  //   setReviewFormData({ review: "", rating: 0 });
  //   setActiveReplyIndex(null);

  //   setReplies(replies);
  //   setReviewsData((prev) => [
  //     {
  //       id: rev?.id,
  //       avatar: data?.data?.user?.avatar,
  //       username: data?.data?.user.username || "Anonymous",
  //       comment: rev?.comment,
  //       rating: rev?.rating,
  //     },
  //     ...prev,
  //   ]);

  //   toast("Reply sent...");
  // };

  const handleSubmitReply = async () => {
    try {
      if (!reviewFormData.review) {
        toast.error("Please enter a review");
        return;
      }
      if (reviewFormData.rating === 0) {
        toast.error("Please select a rating");
        return;
      }

      const form = new FormData();
      form.append("comment", reviewFormData.review);
      form.append("rating", reviewFormData.rating.toString());

      const response = await addServiceReview(form, artisan?.id as any);
      const data = await response?.json();
      if (data?.status === true) {
        const rev = data.data.reviews;
        setReviewFormData({ review: "", rating: 0 });
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
        const response = await getServiceReviewsReplies(productId, reviewId);
        const data = await response?.json();

        setReviewRepliesData((prev) => ({
          ...prev,
          comment: data?.data?.reviews?.comment,
        }));
        //         setReviewOverview({
        //   averageRating: data?.data?.ratings_overview?.averageRating,
        //   totalReviews: data?.data?.ratings_overview?.totalReviews,
        //   ratingCounts: data?.data?.ratings_overview?.ratingCounts,
        // } as any);
        // setReviewsData((prev) => [
        //   ...prev,
        //   {
        //     id: review?.id,
        //     customerName: review?.customer_name,
        //     comment: review?.comment,
        //     rating: review?.rating,
        //     customerAvatar: review?.customer_photo,
        //     date: new Date("2024-02-20"),
        //     reply: null,
        //     status: "visible",
        //   },
        // ]);
      }
    } catch (error) {
      console.error("Error fetching review replies:", error);
    }
  };

  if (loading) {
    return (
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#502266] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading artisan profile...</p>
        </div>
      </main>
    );
  }

  if (!artisan) {
    return (
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Artisan Not Found
          </h1>
          <p className="text-gray-600">
            The artisan profile you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/artisans")} className="mt-4">
            Browse Other Artisans
          </Button>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="py-32 w-full mx-auto max-w-7xl p-4">
        <div className="mb-8 grid gap-8 md:grid-cols-[1fr_400px]">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
            <Image
              src={
                artisan?.artisan_business_details?.image ||
                "/assets/images/tailor.png?height=300&width=400"
              }
              alt="Artisan workshop"
              fill
              className="rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-bold">
                {`${artisan?.firstname} ${artisan?.lastname}`}&apos;s Workshop
              </h1>
            </div>
          </div>

          {/* Profile Section */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Image
                    src={
                      artisan?.artisan_business_details?.image ||
                      "/assets/images/tailor.png?height=300&width=400"
                    }
                    alt="Profile"
                    width={60}
                    height={60}
                    className="rounded-md bg-gray-100 object-cover"
                  />
                  <div>
                    <h1 className="text-xl font-semibold text-[#502266]">
                      {`${artisan?.firstname} ${artisan?.lastname}`}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Professional Artisan
                    </p>
                  </div>
                </div>
                <Badge className="flex items-center bg-[#FF7F00] hover:bg-[#FF7F00]/90 gap-1">
                  <Star className="h-3 w-3" />
                  Verified
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-[#502266] text-[#502266]"
                >
                  {artisan?.artisan_business_details?.service_category?.name}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#FF7F00] text-[#FF7F00]"
                >
                  {
                    artisan?.artisan_business_details?.service_category_item
                      ?.name
                  }
                </Badge>
              </div>

              <Button
                onClick={handleMessageArtisan}
                className="mt-4 w-full bg-[#502266] hover:bg-[#502266]/90"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Artisan
              </Button>
              <p className="mt-2 text-center text-xs text-gray-600">
                We respond quickly, usually within a few hours
              </p>
            </div>

            <div className="rounded-lg border p-6 bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-[#502266] mb-3">
                About this artisan
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {artisan?.artisan_business_details?.business_details ||
                  "This artisan provides quality services with attention to detail and customer satisfaction."}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.5</span>
                  <span className="text-sm text-gray-600">
                    (24 completed orders)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Location:</span>{" "}
                    {artisan?.artisan_business_details?.city || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Services:</span>{" "}
                    {artisan?.artisan_service_listing?.length || 0} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#502266]">
              Available Services
            </h2>
            <Badge variant="outline" className="text-sm">
              {artisan?.artisan_service_listing?.length || 0} services
            </Badge>
          </div>

          {artisan?.artisan_service_listing &&
          artisan.artisan_service_listing.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {artisan.artisan_service_listing.map((listing) => (
                  <div
                    key={listing.id}
                    className="transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Card
                      className={`overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105
                      }`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={
                            listing.image ||
                            "/assets/images/tailor.png?height=300&width=400"
                          }
                          alt={listing.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Price Badge */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge className="bg-[#FF7F00] text-white border-none">
                            ${parseFloat(listing.price.toString()).toFixed(2)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="bg-[#240F2E] text-white p-4 relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-lg font-semibold text-[#FF7F00] mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                            {listing.title}
                          </h3>

                          <Badge
                            variant="secondary"
                            className="mb-3 bg-white/10 text-white border-white/20"
                          >
                            {listing.service_category?.name ||
                              artisan?.artisan_business_details
                                ?.service_category?.name ||
                              "Service"}
                          </Badge>

                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm flex items-center">
                              ⭐⭐⭐⭐⭐
                              <span className="ml-1">(4.5)</span>
                            </p>
                            <span className="text-[#FF7F00] font-semibold">
                              ${parseFloat(listing.price.toString()).toFixed(2)}
                            </span>
                          </div>

                          <Button
                            onClick={() => handleBookService(listing.id)}
                            className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white transition-all duration-300 transform hover:scale-105"
                            size="sm"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {artisan.artisan_service_listing.length > 4 && (
                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    className="border-[#502266] text-[#502266] hover:bg-[#502266] hover:text-white"
                  >
                    View all ({artisan.artisan_service_listing.length}) services
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This artisan hasn&apos;t listed any services yet. Check back
                later or browse other talented artisans.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push("/artisans")}
                  className="bg-[#FF7F00] hover:bg-[#FF7F00]/90"
                >
                  Browse Other Artisans
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <h1 className="font-bold text-2xl">Customer Reviews</h1>

        <div className="space-y-6">
          {reviewsData?.length > 0 ? (
            reviewsData?.map((item: any, i) => (
              <div key={i} className="border-t pt-6">
                <p>hbjbjb nknknkn knk</p>
                <ReviewCard
                  avatar={item?.avatar}
                  username={item?.username}
                  rating={item?.rating}
                  comment={item?.comment}
                />

                <div className="flex gap-4 mt-2">
                  <p
                    onClick={() => handleFetchReviewReplies(2, item?.id)}
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
                        avatar={reviewRepliesData?.avatar}
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
          setFormData={setReviewFormData}
          formData={reviewFormData}
        />
      </main>
    </Suspense>
  );
};

export default Service;
