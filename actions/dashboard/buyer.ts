import { baseUrl } from "@/config/constant";
import Cookies from "js-cookie";

export const getProductOverview = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/productOverview`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
};

export const getServiceOverview = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/serviceOverview`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch service menu", error);
  }
};

export const getOrderlist = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/products/list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
};

export const getBookinglist = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/services/list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch bookings", error);
  }
};

export const getOrderDetail = async (id) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/products/itemsList/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch order details");
  }
};

export const getBookingDetail = async (id) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/services/itemsDetails/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch order details");
  }
};
