"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createServicePaymentIntent } from "@/actions/checkout";
import { getProvinces } from "@/actions/provinces";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import {
  addServiceReview,
  getServiceDetail,
  getServiceReviews,
  getServiceReviewsReplies,
} from "@/actions/service";
import Cookies from "js-cookie";
import { StripeServicePaymentForm } from "./StripeServicePaymentForm";
import BookingOrderSummary from "@/app/(site)/booking/BookingOrderSummary";
import { usePaymentProvider } from "@/context/PaymentContext ";
import { ReplyForm, ReviewCard } from "./reviews/utils";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Service = {
  "Service Details": any;
};

type ReviewData = {
  id: string;
  avatar: string;
  username: string;
  productId?: number;
  comment: string;
  rating: number;
};

export default function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const serviceId = params.get("serviceId");
  const [service, setService] = useState<Service | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const { formData, setFormData, handleInputChange } = usePaymentProvider();
  const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);
  const [reviewFormData, setReviewFormData] = useState<{
    review: string;
    rating: number;
  }>({ review: "", rating: 0 });
  const [reviewRepliesData, setReviewRepliesData] = useState<ReviewData>({
    id: "",
    username: "Vendor",
    productId: 1,
    comment: "",
    rating: 0,
    avatar: "https://i.pravatar.cc/40?img=1",
  });
  const [replies, setReplies] = useState({
    0: [{ text: "Reply 1" }],
    1: [],
    2: [],
  });
  const rating = 4.5;

  const handleGetProvinces = useCallback(async () => {
    const response = await getProvinces();
    if (response && response.ok) {
      const data = await response.json();
      setProvinces(data.data["Provinces"]);
    }
  }, []);

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

      const response = await addServiceReview(
        form,
        service!["Service Details"]?.id
      );
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

  const handleFetchReview = useCallback(async (serviceId: number) => {
    try {
      const response = await getServiceReviews(serviceId);
      const data = await response?.json();
      const transformedData = data?.data?.reviews?.map((item: any) => ({
        id: item.id,
        username: item.customer_name,
        comment: item.comment,
        rating: item.rating,
        avatar: item.customer_photo,
      }));
      setReviewsData(transformedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, []);

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
      }
    } catch (error) {
      console.error("Error fetching review replies:", error);
    }
  };

  const createStripePaymentIntent = useCallback(async () => {
    const response = await createServicePaymentIntent(serviceId!);
    if (response.ok) {
      const data = await response.json();
      setClientSecret(data.data["clientSecret"]);
      setCheckoutData(data.data);
    }
  }, [serviceId]);

  const fetchServiceDetail = useCallback(
    async (id) => {
      const response = await getServiceDetail(id);
      if (response && response.ok) {
        const data = await response.json();
        setService(data.data);
        setCheckoutData(data.data);

        setFormData((prev) => ({
          ...prev,
          listingId: data.data["Service Details"]?.id || "",
        }));
      }
    },
    [setFormData]
  );

  useEffect(() => {
    if (!Cookies.get("accessToken")) router.push("/auth/login");

    if (serviceId) {
      fetchServiceDetail(serviceId);
      handleFetchReview(parseInt(serviceId));
    }
  }, [fetchServiceDetail, handleFetchReview, serviceId]);

  useEffect(() => {
    (async () => {
      await handleGetProvinces();
      await createStripePaymentIntent();
    })();
  }, [createStripePaymentIntent, handleGetProvinces]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="container mx-auto py-32">
      <>
        <h3 className="text-3xl font-bold mb-6">Checkout</h3>
        {service && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 pr-0 lg:pr-4 mx-6">
              <div className="lg:col-span-1 lg:hidden">
                <BookingOrderSummary service={service} />
              </div>
              <div className="mb-4">
                {/* About service */}
                <h2 className="font-bold text-lg mb-4">1. About</h2>
                <Tabs defaultValue="service" className="w-auto mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger className="py-2" value="service">
                      Service
                    </TabsTrigger>
                    <TabsTrigger className="py-2" value="artisan">
                      Artisan
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="service">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {capitalizeFirstLetter(
                            service["Service Details"]?.title
                          )}
                        </CardTitle>
                        <CardDescription>
                          {capitalizeFirstLetter(
                            service["Service Details"]?.booking_details
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="description">Description</Label>
                          <p>
                            {capitalizeFirstLetter(
                              service["Service Details"]?.description
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="artisan">
                    <Card>
                      <CardHeader>
                        <CardTitle>Artisan Name</CardTitle>
                        <CardDescription>
                          {capitalizeFirstLetter(
                            service["Service Details"]?.artisan_name ||
                              "Anonymous"
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="current">Shop Address</Label>
                          <p>
                            {" "}
                            {capitalizeFirstLetter(
                              service["Service Details"]?.booking_details
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <form
                  id="checkout-form"
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                >
                  <input
                    hidden
                    value={service["Service Details"]?.id}
                    name="listingId"
                  />
                  {/* Date Information */}
                  <h2 className="font-bold text-lg mb-4">2. Scheduling</h2>
                  <label className="font-bold">Date & Time Availability</label>

                  <select
                    onChange={handleInputChange}
                    className="h-12 mt-2 border-2 w-full px-2"
                    name="dates"
                  >
                    <option value="">Please select</option>
                    {service?.["Date & Time Availability"] &&
                      Object.entries(service["Date & Time Availability"]).map(
                        ([date, times]) =>
                          (times as string[]).map((time, index) => (
                            <option
                              className="my-4 rounded-lg"
                              key={`${date}-${index}`}
                              value={`${date} ${time}`}
                            >
                              {`${date} ${time}`}
                            </option>
                          ))
                      )}
                  </select>

                  <div className="flex space-x-4 flex-col ">
                    <label className="font-bold">
                      Do you want home services{" "}
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="checkbox"
                        name="homeService"
                        onChange={handleInputChange}
                        checked={formData.homeService || false}
                      />

                      <label>Yes, I want Home Services </label>
                    </div>
                  </div>

                  {formData.homeService ? (
                    <>
                      <div className="border rounded-lg p-4">
                        <h2 className="font-bold text-lg mb-4">
                          1. Contact Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Full Name*
                            </label>
                            <input
                              type="text"
                              name="fullname"
                              value={formData.fullname}
                              onChange={handleInputChange}
                              placeholder="John Pearson"
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email*
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="name@example.com"
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+1 (555) 123-4567"
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div className="border rounded-lg p-4">
                        <h2 className="font-bold text-lg mb-4">
                          2. Shipping Information
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Address*
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="1234 Main St"
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                City*
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Postal Code*
                              </label>
                              <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="12345"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Province
                            </label>
                            <select
                              name="provinceId"
                              value={formData.provinceId}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 border pl-2"
                            >
                              <option value="">Select a province</option>
                              {provinces.map((province: any) => (
                                <option key={province.id} value={province.id}>
                                  {province.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </form>
              </div>

              {/* Payment Information */}
              <div className="lg:col-span-1">
                <h2 className="font-bold text-lg mb-4">
                  3. Payment Information
                </h2>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeServicePaymentForm
                      onSuccess={handleFormSubmit}
                      checkoutData={checkoutData}
                      // {...formData}
                    />
                  </Elements>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <Loader2 className="animate-spin text-purple-950 h-[3rem] w-[3rem]" />
                    <p>Loading paywall...</p>
                  </div>
                )}
              </div>

              <div className="md:mt-8 mt-16">
                <h2 className="text-2xl font-semibold mb-4">
                  Customer Reviews
                </h2>

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
                      Based on {6} reviews
                    </p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center">
                        <span className="text-sm text-gray-600 w-2">
                          {star}
                        </span>
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
                            onClick={() =>
                              handleFetchReviewReplies(2, item?.id)
                            }
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
                  setFormData={setReviewFormData}
                  formData={reviewFormData}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 hidden lg:block">
              <BookingOrderSummary service={service} />
            </div>
          </div>
        )}
      </>
    </div>
  );
}
