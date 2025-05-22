import { baseUrl } from "../../config/constant";
import Cookies from "js-cookie";

export const createServiceListing = async (requestPayload: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/create`,
      {
        method: "POST",
        body: requestPayload,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Vendor listing detail creation failed", error);
  }
};

export const deleteServiceListing = async (serviceId) => {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/destroy/${serviceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Vendor listing detail creation failed", error);
  }
};

export const getArtisanAnalytics = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceOverview`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getserviceListings = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Error fetching service listing", error);
  }
};

export const getAppointments = async (date: string | null) => {
  const token = Cookies.get("accessToken");
  console.log({ date });
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceBooking/list${
        date ? `?bookedDate=${date}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Error fetching appointment listing failed", error);
  }
};

export const bookingCompleteHandler = async (bookingId) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceBooking/markAsCompleted/${bookingId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Error fetching appointment listing failed", error);
  }
};

export const bookingInprogressHandler = async (bookingId) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceBooking/approve/${bookingId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Error fetching appointment listing failed", error);
  }
};

export const rescheduleBookingHandler = async (bookingId, payload) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceBooking/reschedule/${bookingId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Error fetching appointment listing failed", error);
  }
};

export const getPromotions = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/discount/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error: any) {
    console.log("Failed ro fetch promotions", error);
  }
};

export const createPromotions = async (payload) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/discount/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Failed to create promotions", error);
  }
};

export const deletePromotions = async (promotionId: any) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/discount/destroy/${promotionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Error  deleting promotions", error);
  }
};

export const getOrders = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/orderManagement/list
`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Failed ro fetch promotions", error);
  }
};

export const getOrderDetails = async (id) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/orderManagement/getOrderItemsList/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("Failed ro fetch promotions", error);
  }
};

export async function getCustomerReviews(serviceId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/getReviews/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
}

export async function getCustomerReviewsReply(
  productId: number,
  reviewId: number
) {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/getReviewsReply/${productId}/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
}

export async function replyCustomerReview(payload: any, reviewId: number) {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/postReplyReviews/${reviewId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
}
