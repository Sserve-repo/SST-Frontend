import { apiRequest } from "@/hooks/use-api"

export interface ProductCategory {
  id: number
  name: string
}

export interface ProductSubcategory {
  id: number
  name: string
}

export interface Product {
  id: number
  user_id: number
  title: string
  price: string
  stock_level: number
  shipping_cost: string
  description: string
  image: string
  status: number
  is_featured: number
  product_discount_id: number | null
  product_images: string[]
  vendor_name: string
  vendor_email: string
  category: ProductCategory
  subcategory: ProductSubcategory
  created_at: string
  updated_at: string
}

export interface ProductListResponse {

  productListing: Product[]
  listingCounts: {
    allProducts: number
    pendingProducts: number
    approvedProducts: number
    rejectedProducts: number
    disabledProducts: number
  }
  current_page: number
  per_page: number
  total: number
  last_page: number

}

export interface ProductDetailResponse {
  data: {
    productListing: Product
  }
}

export async function getProducts(params?: Record<string, string>) {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        // Map category to product_category for API
        if (key === "category") {
          queryParams.append("product_category", value)
        } else {
          queryParams.append(key, value)
        }
      }
    })
  }

  const endpoint = `/admin/dashboard/productListing/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  return apiRequest<ProductListResponse>(endpoint)
}

export async function getProductById(id: string) {
  return apiRequest<ProductDetailResponse>(`/admin/dashboard/productListing/show/${id}`)
}

export async function updateProductStatus(data: {
  status: string
  product_ids: number[]
}) {
  const formData = new FormData()
  formData.append("status", data.status)
  data.product_ids.forEach((id) => {
    formData.append("product_ids[]", id.toString())
  })

  return apiRequest<any>("/admin/dashboard/productListing/updateStatus", {
    method: "POST",
    body: formData,
    isFormData: true,
  })
}

export async function disableProducts(product_ids: number[]) {
  const formData = new FormData()
  product_ids.forEach((id) => {
    formData.append("product_ids[]", id.toString())
  })
  return apiRequest<any>("/admin/dashboard/productListing/disable", {
    method: "POST",
    body: formData,
    isFormData: true,
  })
}

export async function updateProductFeatureStatus(data: {
  product_ids: number[]
  is_featured: boolean
}) {
  const endpoint = data.is_featured
    ? "/admin/dashboard/productListing/isFeatured"
    : "/admin/dashboard/productListing/removeFeatured"

  return apiRequest<any>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      product_ids: data.product_ids,
    },
  })
}

export async function deleteProduct(id: string) {
  return apiRequest<any>(`/admin/dashboard/productListing/destroy/${id}`, {
    method: "DELETE",
  })
}

export async function updateProduct(id: string, data: FormData) {
  return apiRequest<any>(`/admin/dashboard/productListing/update/${id}`, {
    method: "POST",
    body: data,
    isFormData: true,
  })
}
