import { apiRequest } from "@/hooks/use-api";

export interface Service {
  id: number;
  user_id: number;
  title: string;
  price: string;
  service_duration: string;
  description: string;
  image: string;
  status: number;
  featured: boolean | false;
  created_at: string;
  updated_at: string;
  available_dates: string[] | null;
  start_time: string | null;
  end_time: string | null;
  home_service_availability: string | null;
  service_images: string[];
  vendor_name: string;
  vendor_email: string;
  service_category: {
    id: number;
    name: string;
  };
  service_category_item: {
    id: number;
    name: string;
  };
}

export interface ServiceListResponse {
  serviceListing: Service[];
}

export interface ServiceDetailResponse {
  serviceListing: Service;
}

export async function getServices(params?: {
  service_category?: string;
  status?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();

  if (params?.service_category)
    queryParams.append("service_category", params.service_category);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);

  const endpoint = `/admin/dashboard/serviceListing/list${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return apiRequest<ServiceListResponse>(endpoint);
}

export async function getServiceById(id: string) {
  return apiRequest<ServiceDetailResponse>(
    `/admin/dashboard/serviceListing/show/${id}`
  );
}

export async function updateService(id: string, formData: FormData) {
  return apiRequest<any>(`/admin/dashboard/serviceListing/update/${id}`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function updateServiceStatus(payload: {
  status: "approved" | "rejected" | "pending";
  service_ids: number[];
}) {
  return apiRequest<any>(`/admin/dashboard/serviceListing/updateStatus`, {
    method: "POST",
    body: payload,
  });
}

export async function disableServices(service_ids: number[]) {
  return apiRequest<any>(`/admin/dashboard/serviceListing/deleteService`, {
    method: "GET",
    body: { service_ids },
  });
}
