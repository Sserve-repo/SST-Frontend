import { baseUrl } from "../../config/constant";
import Cookies from "js-cookie";

export const getVendorAnalytics = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/vendor/dashboard/productOverview`,
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

export const getInventoryItems = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/vendor/dashboard/productListing/list`,
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

export const createProduct = async (requestPayload: any) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/vendor/dashboard/productListing/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: requestPayload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Vendor listing detail creation failed", error);
  }
};

export async function getCustomerReviews(productId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/vendor/dashboard/productListing/getReviews/${productId}`,
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

export async function getCustomerReviewsReply(productId: number, reviewId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/vendor/dashboard/productListing/getReviewsReply/${productId}/${reviewId}`,
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
      `${baseUrl}/vendor/dashboard/productListing/postReplyReviews/${reviewId}`,
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

export const getPromotions = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/discount/list`, {
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
      `${baseUrl}/vendor/dashboard/discount/create`,
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
      `${baseUrl}/vendor/dashboard/discount/destroy/${promotionId}`,
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
      `${baseUrl}/vendor/dashboard/orderManagement/list
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
      `${baseUrl}/vendor/dashboard/orderManagement/getOrderItemsList/${id}`,
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
