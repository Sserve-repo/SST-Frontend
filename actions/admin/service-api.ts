import { apiRequest } from "@/hooks/use-api"

export interface ServiceCategory {
  id: number
  name: string
}

export interface ServiceCategoryItem {
  id: number
  name: string
}

export interface ServiceImage {
  id: number
  user_id: number
  service_listing_detail_id: number
  image: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  user_id: number
  title: string
  price: string
  service_duration: string
  description: string
  image: string | null
  status: number
  is_featured: number
  available_dates: string[]
  start_time: string
  end_time: string
  home_service_availability: string
  service_images: string[] | ServiceImage[]
  vendor_name: string
  vendor_email: string
  service_category: ServiceCategory
  service_category_item: ServiceCategoryItem
  created_at: string
  updated_at: string
}

export interface ServiceListResponse {


  serviceListing: Service[]
  listingCounts: {
    allServices: number
    pendingServices: number
    approvedServices: number
    rejectedServices: number
    disabledServices: number
  }
  current_page: number
  per_page: number
  total: number
  last_page: number

}

export interface ServiceDetailResponse {
  data: {
    serviceListing: Service
  }
}

export async function getServices(params?: Record<string, string>) {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        // Map category to service_category for API
        if (key === "category") {
          queryParams.append("service_category", value)
        } else {
          queryParams.append(key, value)
        }
      }
    })
  }

  const endpoint = `/admin/dashboard/serviceListing/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  return apiRequest<ServiceListResponse>(endpoint)
}

export async function getServiceById(id: string) {
  return apiRequest<ServiceDetailResponse>(`/admin/dashboard/serviceListing/show/${id}`)
}

export async function updateServiceStatus(data: {
  status: string
  service_ids: number[]
}) {
  return apiRequest<any>("/admin/dashboard/serviceListing/updateStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      status: data.status,
      service_ids: data.service_ids,
    },
  })
}

export async function updateServiceFeatureStatus(data: {
  service_ids: number[]
  is_featured: boolean
}) {
  const endpoint = data.is_featured
    ? "/admin/dashboard/serviceListing/isFeatured"
    : "/admin/dashboard/serviceListing/removeFeatured"

  return apiRequest<any>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      service_ids: data.service_ids,
    },
  })
}

export async function disableServices(serviceIds: number[]) {
  return updateServiceStatus({
    status: "disabled",
    service_ids: serviceIds,
  })
}

export async function deleteService(id: string) {
  return apiRequest<any>(`/admin/dashboard/serviceListing/destroy/${id}`, {
    method: "DELETE",
  })
}

export async function updateService(id: string, data: FormData) {
  return apiRequest<any>(`/admin/dashboard/serviceListing/update/${id}`, {
    method: "POST",
    body: data,
    isFormData: true,
  })
}
