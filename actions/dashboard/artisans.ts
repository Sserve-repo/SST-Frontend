import { baseUrl } from "../../config/constant"
import Cookies from "js-cookie"
import type { RescheduleData } from "@/types"

export const createServiceListing = async (requestPayload: FormData) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/create`, {
      method: "POST",
      body: requestPayload,
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Service listing creation failed", error)
    throw error
  }
}

export const updateServiceListing = async (serviceId: string, requestPayload: FormData) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/update/${serviceId}`, {
      method: "POST",
      body: requestPayload,
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Service listing update failed", error)
    throw error
  }
}

export const deleteServiceListing = async (serviceId: string) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/destroy/${serviceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Service listing deletion failed", error)
    throw error
  }
}

export const getServiceDetails = async (serviceId: string) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/show/${serviceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Service details fetch failed", error)
    throw error
  }
}

export const getArtisanAnalytics = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceOverview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Analytics fetch failed", error)
    throw error
  }
}

export const getserviceListings = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching service listing", error)
    throw error
  }
}

export const getAppointments = async (date: string | null | undefined) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceBooking/list${date ? `?bookedDate=${date}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error: any) {
    console.log("Error fetching appointment listing failed", error)
    throw error
  }
}

export const bookingCompleteHandler = async (bookingId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceBooking/markAsCompleted/${bookingId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response
  } catch (error: any) {
    console.log("Error completing booking", error)
    throw error
  }
}

export const bookingInprogressHandler = async (bookingId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceBooking/approve/${bookingId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response
  } catch (error: any) {
    console.log("Error approving booking", error)
    throw error
  }
}

export const rescheduleBookingHandler = async (bookingId: string, data: RescheduleData) => {
  const token = Cookies.get("accessToken")
  try {
    const formData = new FormData()
    formData.append("booked_date", data.booked_date)
    formData.append("booked_time", data.booked_time)

    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceBooking/reschedule/${bookingId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    return response
  } catch (error: any) {
    console.log("Error rescheduling booking", error)
    throw error
  }
}

export const cancelBookingHandler = async (bookingId: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceBooking/cancel/${bookingId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response
  } catch (error: any) {
    console.log("Error cancelling booking", error)
    throw error
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

    const response = await fetch(`${baseUrl}/artisan/dashboard/discount/list?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch promotions", error)
    throw error
  }
}

export const getPromotionStatuses = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/discount/getDiscountStatuses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch promotion statuses", error)
    throw error
  }
}

export const createPromotions = async (payload: FormData) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/discount/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
    return response
  } catch (error: any) {
    console.log("Failed to create promotions", error)
    throw error
  }
}

export const deletePromotions = async (promotionId: any) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/discount/destroy/${promotionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error deleting promotions", error)
    throw error
  }
}

export const getOrders = async () => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/orderManagement/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch orders", error)
    throw error
  }
}

export const getOrderDetails = async (id: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/orderManagement/getOrderItemsList/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Failed to fetch order details", error)
    throw error
  }
}

export async function getCustomerReviews(serviceId: number) {
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/getReviews/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("failed to fetch service reviews", error)
    throw error
  }
}

export async function getCustomerReviewsReply(productId: number, reviewId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/dashboard/serviceListing/getReviewsReply/${productId}/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      },
    )
    return response
  } catch (error: any) {
    console.log("failed to fetch review replies", error)
    throw error
  }
}

export async function replyCustomerReview(payload: any, reviewId: number) {
  try {
    const token = Cookies.get("accessToken")
    if (!token) {
      throw new Error("No access token found")
    }
    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/postReplyReviews/${reviewId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
    return response
  } catch (error: any) {
    console.log("failed to reply to review", error)
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

    const response = await fetch(`${baseUrl}/artisan/dashboard/events/list?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching events", error)
    throw error
  }
}

export const getEventById = async (id: string) => {
  const token = Cookies.get("accessToken")
  try {
    const response = await fetch(`${baseUrl}/artisan/dashboard/events/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching event", error)
    throw error
  }
}

// Services API functions with pagination
export const getServices = async (page = 1, limit = 10, search = "") => {
  const token = Cookies.get("accessToken")
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceListing/list?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching services", error)
    throw error
  }
}

// Appointments API functions with pagination
export const getAppointmentsPaginated = async (page = 1, limit = 10, search = "", date?: string) => {
  const token = Cookies.get("accessToken")
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(date && { bookedDate: date }),
    })

    const response = await fetch(`${baseUrl}/artisan/dashboard/serviceBooking/list?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.log("Error fetching appointments", error)
    throw error
  }
}
