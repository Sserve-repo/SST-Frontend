import { apiRequest } from "@/hooks/use-api";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  stock_level: number;
  shipping_cost: string;
  image: string;
  vendor_name: string;
  vendor_email: string;
  featured: string;
  status: number;
  created_at: string;
  updated_at: string;
  product_discount_id: number | null;
  product_images: string[];
  category: {
    id: number;
    name: string;
  };
  subcategory: {
    id: number;
    name: string;
  };
}

export interface ProductListResponse {
  productListing: Product[];
}

export interface ProductDetailResponse {
  productListing: Product;
}

export async function getProducts(params?: {
  product_category?: string;
  status?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();

  if (params?.product_category)
    queryParams.append("product_category", params.product_category);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);

  const endpoint = `/admin/dashboard/productListing/list${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return apiRequest<ProductListResponse>(endpoint);
}

export async function getProductById(id: string) {
  return apiRequest<ProductDetailResponse>(
    `/admin/dashboard/productListing/show/${id}`
  );
}

export async function updateProduct(id: string, formData: FormData) {
  return apiRequest<any>(`/admin/dashboard/productListing/update/${id}`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function updateProductStatus(payload: {
  status: "approved" | "rejected" | "pending" | "disabled";
  product_ids: number[];
}) {
  return apiRequest<any>(`/admin/dashboard/productListing/updateStatus`, {
    method: "POST",
    body: payload,
  });
}

export async function disableProducts(product_ids: number[]) {
  return apiRequest<any>(`/admin/dashboard/productListing/deleteProduct`, {
    method: "DELETE",
    body: { product_ids },
  });
}
