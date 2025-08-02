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

export const getOrderDetail = async (id: string | number) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      return {
        data: null,
        error: "Authentication token not found"
      };
    }

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/products/itemsDetails/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Order detail API response:", result);

    // Parse and enhance the order activity status
    if (result.data && result.data.order_activity) {
      const activity = result.data.order_activity;
      const activityStatus = {
        id: activity.id,
        user_id: activity.user_id,
        order_product_id: activity.order_product_id,
        status: {
          pending: activity.pending_at,
          processing: activity.processing_at,
          in_transit: activity.intransit_at,
          delivered: activity.delivered_at,
          cancelled: activity.cancelled_at,
        },
        current_status: getCurrentOrderStatus(activity),
        created_at: activity.created_at,
        updated_at: activity.updated_at,
      };

      result.data.parsed_order_activity = activityStatus;
    }

    return {
      data: result.data,
      error: null
    };
  } catch (error: any) {
    console.error("Failed to fetch order details:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch order details"
    };
  }
};

// Helper function to determine current order status
const getCurrentOrderStatus = (activity: any) => {
  if (activity.delivered_at) return "delivered";
  if (activity.intransit_at) return "in_transit";
  if (activity.processing_at) return "processing";
  if (activity.cancelled_at) return "cancelled";
  if (activity.pending_at) return "pending";
  return "unknown";
};

export const getBookingDetail = async (id: string | number) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      return {
        data: null,
        error: "Authentication token not found"
      };
    }

    const response = await fetch(
      `${baseUrl}/shopper/dashboard/orders/services/itemsDetails/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Booking detail API response:", result);

    // Parse and enhance the booking activity status
    if (result.data && result.data.booking_activity) {
      const activity = result.data.booking_activity;
      const activityStatus = {
        id: activity.id,
        user_id: activity.user_id,
        service_booking_id: activity.service_booking_id,
        status: {
          pending: activity.pending_at,
          rescheduled: activity.reschedule_at,
          cancelled: activity.cancel_at,
          approved: activity.approve_at,
          completed: activity.markAsCompleted_at,
        },
        current_status: getCurrentBookingStatus(activity),
        created_at: activity.created_at,
        updated_at: activity.updated_at,
      };

      result.data.parsed_booking_activity = activityStatus;
    }

    return {
      data: result.data,
      error: null
    };
  } catch (error: any) {
    console.error("Failed to fetch booking details:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch booking details"
    };
  }
};

// Helper function to determine current booking status
const getCurrentBookingStatus = (activity: any) => {
  if (activity.markAsCompleted_at) return "completed";
  if (activity.approve_at) return "approved";
  if (activity.cancel_at) return "cancelled";
  if (activity.reschedule_at) return "rescheduled";
  if (activity.pending_at) return "pending";
  return "unknown";
};
