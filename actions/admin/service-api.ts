import { apiRequest } from "@/hooks/use-api"

export interface Service {
  id: number
  user_id: number
  title: string
  price: string
  description: string
  image: string
  status: number
  created_at: string
  updated_at: string
  vendor_name: string
  vendor_email: string
  service_category: {
    id: number
    name: string
  }
  service_duration: string
  available_dates: string[] | string
  home_service_availability: boolean
  featured?: boolean
}

export interface ServiceListResponse {
  status: boolean
  status_code: number
  message: string

  serviceListing: Service[]
  listingCounts?: {
    allServices: number
    pendingServices: number
    approvedServices: number
    rejectedServices: number
    disabledServices: number
  }
  current_page: number
  total: number
  last_page: number
  per_page: number

  token: null
  debug: null
}

const getStatusFromNumber = (status: number): "pending" | "approved" | "rejected" | "disabled" => {
  switch (status) {
    case 1:
      return "approved"
    case 2:
      return "rejected"
    case 3:
      return "disabled"
    default:
      return "pending"
  }
}

export async function getServices(params: Record<string, string> = {}) {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams()

    // Map frontend filter names to API parameter names
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        switch (key) {
          case "category":
            queryParams.append("service_category", value)
            break
          case "service_category": // Add this case to handle direct service_category param
            queryParams.append("service_category", value)
            break
          case "status":
            // Map status strings to numbers for API
            const statusMap: Record<string, string> = {
              pending: "pending",
              approved: "approved",
              rejected: "rejected",
              disabled: "disabled3",
            }
            queryParams.append("status", statusMap[value] || value)
            break
          case "search":
            queryParams.append("search", value)
            break
          default:
            queryParams.append(key, value)
        }
      }
    })

    const endpoint = `/admin/dashboard/serviceListing/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    return apiRequest<ServiceListResponse>(endpoint)
  } catch (error) {
    console.error("Error fetching services:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch services",
    }
  }
}

export async function updateServiceStatus(payload: {
  status: string
  service_ids: number[]
}) {
  try {
    return apiRequest<any>("/admin/dashboard/serviceListing/updateStatus", {
      method: "POST",
      body: payload,
    })
  } catch (error) {
    console.error("Error updating service status:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update service status",
    }
  }
}

export async function disableServices(serviceIds: number[]) {
  try {
    return apiRequest<any>("/admin/dashboard/serviceListing/updateStatus", {
      method: "POST",
      body: {
        status: "disabled",
        service_ids: serviceIds,
      },
    })
  } catch (error) {
    console.error("Error disabling services:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to disable services",
    }
  }
}
