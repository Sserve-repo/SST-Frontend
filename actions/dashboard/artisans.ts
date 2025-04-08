import { baseUrl } from "../../config/constant";
import Cookies from "js-cookie";

export const getVendorAnalytics = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/productOverview`,
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
      `${baseUrl}/artisan/dashboard/productListing/list`,
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
      `${baseUrl}/artisan/dashboard/productListing/create`,
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
