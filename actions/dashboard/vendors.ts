import { baseUrl } from "../../config/constant"
import Cookies from "js-cookie"

export const getVendorAnalytics = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productOverview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Form validation failed", error)
  }
}

export const getInventoryItems = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Form validation failed", error)
  }
}

export const getProductDetails = async (productId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/show/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch product details", error)
  }
}

export const createProduct = async (requestPayload: any) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: requestPayload,
    })
    return response
  } catch (error: any) {
    console.log("Vendor listing detail creation failed", error)
  }
}

export const updateProduct = async (productId: string, requestPayload: any) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/update/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: requestPayload,
    })
    return response
  } catch (error: any) {
    console.log("Product update failed", error)
  }
}

export const deleteProduct = async (productId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/destroy/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Product deletion failed", error)
  }
}

export const getProductCategories = async () => {
  try {
    const response = await fetch(`${baseUrl}/general/products/getCategory`);
    return response;
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getProductCategoryItemsById = async (catId) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getCategoryItemsByProductCategoryId/${catId}`
    );
    return response;
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};


export async function getCustomerReviews(productId: number) {
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/getReviews/${productId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("failed to fetch product reviews", error)
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
      },
    )
    return response
  } catch (error: any) {
    console.log("failed to fetch product review replies", error)
  }
}

export async function replyCustomerReview(payload: any, reviewId: number) {
  try {
    const token = Cookies.get("accessToken")
    if (!token) {
      throw new Error("No access token found")
    }
    const response = await fetch(`${baseUrl}/vendor/dashboard/productListing/postReplyReviews/${reviewId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
    return response
  } catch (error: any) {
    console.log("failed to reply to review", error)
  }
}

// Updated promotions functions
export const getPromotions = async (page = 1, limit = 10, search = "") => {
  const token = Cookies.get("accessToken")
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    const response = await fetch(`${baseUrl}/vendor/dashboard/discount/list?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch promotions", error)
  }
}

export const getPromotionStatuses = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/discount/getDiscountStatuses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch promotion statuses", error)
  }
}

export const createPromotions = async (payload: FormData) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/discount/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
    return response
  } catch (error: any) {
    console.log("Failed to create promotions", error)
  }
}

export const deletePromotions = async (promotionId: any) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/discount/destroy/${promotionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error deleting promotions", error)
  }
}

export const getOrders = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/orderManagement/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch orders", error)
  }
}

export const getOrderDetails = async (id: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/orderManagement/getOrderItemsList/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch order details", error)
  }
}

export const updateOrderItemStatus = async (itemId: string, status: string) => {
  const token = Cookies.get("accessToken")
  try {
    const formData = new FormData()
    formData.append("order_status", status)

    const response = await fetch(`${baseUrl}/vendor/dashboard/orderManagement/updateOrderItemStatus/${itemId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    return response
  } catch (error: any) {
    console.log("Failed to update order status", error)
  }
}

// Enhanced messages API functions
export const createMessage = async (payload: FormData) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/chat/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
    return response
  } catch (error: any) {
    console.log("Failed to send message", error)
    throw error
  }
}

export const deleteMessage = async (messageId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/chat/delete/${messageId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error deleting message", error)
    throw error
  }
}

export const deleteFullConversation = async (conversationId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/chat/deleteFullConversation/${conversationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error deleting conversation", error)
    throw error
  }
}

export const fetchLastConversations = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/chat/getLastMessages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching last messages", error)
    throw error
  }
}

export const fetchConversations = async (conversationId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/chat/getFullConversation/${conversationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching conversation", error)
    throw error
  }
}

// Events API functions
export const getEvents = async (page = 1, limit = 10, search = "") => {
  const token = Cookies.get("accessToken")
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    const response = await fetch(`${baseUrl}/vendor/dashboard/events/list?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching events", error)
  }
}

export const getEventById = async (id: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/vendor/dashboard/events/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching event", error)
  }
}
